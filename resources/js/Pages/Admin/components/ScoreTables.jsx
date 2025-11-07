import React, { useState, useEffect } from 'react';
import { 
    Trophy,
    Medal,
    Award,
    Filter,
    RefreshCw
} from 'lucide-react';

const ScoreTables = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [contestants, setContestants] = useState([]);
    const [judges, setJudges] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // Fetch rounds when event is selected
    useEffect(() => {
        if (selectedEvent) {
            fetchRounds(selectedEvent);
        }
    }, [selectedEvent]);

    // Fetch data when round is selected
    useEffect(() => {
        if (selectedRound) {
            fetchRoundData(selectedEvent, selectedRound);
        }
    }, [selectedRound]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/getEvents');
            const data = await response.json();
            const processedEvents = Array.isArray(data) ? data : data?.events || data?.data || [];
            setEvents(processedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRounds = async (eventId) => {
        try {
            setLoading(true);
            const response = await fetch(`/getActiveRounds/${eventId}`);
            const data = await response.json();
            const roundsData = Array.isArray(data) ? data : [];
            setRounds(roundsData);
            
            // Prioritize active round if it exists
            if (roundsData.length > 0) {
                const activeRound = roundsData.find(round => round.is_active === 1 || round.is_active === true);
                if (activeRound) {
                    setSelectedRound(activeRound.round_no);
                } else {
                    // If no active round, select the first one
                    setSelectedRound(roundsData[0].round_no);
                }
            }
        } catch (error) {
            console.error('Error fetching rounds:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoundData = async (eventId, roundNo) => {
        try {
            setLoading(true);
            
            // Fetch contestants for the round
            const contestantsResponse = await fetch(`/get-round-contestants/${eventId}/${roundNo}`);
            const contestantsData = await contestantsResponse.json();
            setContestants(Array.isArray(contestantsData) ? contestantsData : []);

            // Fetch judges for the event
            const judgesResponse = await fetch(`/getJudgesByEvent/${eventId}`);
            const judgesData = await judgesResponse.json();
            setJudges(Array.isArray(judgesData) ? judgesData : judgesData?.judges || []);

            // Fetch criteria for the round
            const criteriaResponse = await fetch(`/getCriteriaByRound/${eventId}/${roundNo}`);
            const criteriaData = await criteriaResponse.json();
            setCriteria(Array.isArray(criteriaData) ? criteriaData : []);

            // Fetch all scores for the round
            const scoresResponse = await fetch(`/getScoresByRound/${eventId}/${roundNo}`);
            const scoresData = await scoresResponse.json();
            setScores(Array.isArray(scoresData) ? scoresData : []);

        } catch (error) {
            console.error('Error fetching round data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get score for specific judge, contestant, and criteria
    const getScore = (judgeId, contestantId, criteriaId) => {
        const score = scores.find(
            s => s.judge_id === judgeId && 
                 s.contestant_id === contestantId && 
                 s.criteria_id === criteriaId
        );
        return score ? parseFloat(score.score || 0).toFixed(2) : '0.00';
    };

    // Calculate total score for a contestant by a judge
    const calculateTotalScore = (judgeId, contestantId) => {
        let total = 0;
        criteria.forEach(criterion => {
            const score = scores.find(
                s => s.judge_id === judgeId && 
                     s.contestant_id === contestantId && 
                     s.criteria_id === criterion.id
            );
            if (score) {
                total += parseFloat(score.score || 0);
            }
        });
        return total.toFixed(2);
    };

    // Calculate weighted percentage for a contestant by a judge
    const calculateWeightedPercentage = (judgeId, contestantId) => {
        let totalPercentage = 0;
        criteria.forEach(criterion => {
            const score = scores.find(
                s => s.judge_id === judgeId && 
                     s.contestant_id === contestantId && 
                     s.criteria_id === criterion.id
            );
            if (score) {
                const weightValue = parseInt(criterion.percentage) / 100;
                totalPercentage += (parseFloat(score.score || 0) / 10) * weightValue * 100;
            }
        });
        return totalPercentage.toFixed(2);
    };

    // Get ranking for each judge's scored contestants
    const getJudgeRankings = (judgeId) => {
        const contestantScores = contestants.map(contestant => ({
            id: contestant.id,
            name: contestant.contestant_name,
            sequence_no: contestant.sequence_no,
            totalScore: parseFloat(calculateTotalScore(judgeId, contestant.id)),
            percentage: parseFloat(calculateWeightedPercentage(judgeId, contestant.id))
        }));

        // Create a copy for ranking calculation (sort by percentage)
        const sortedForRanking = [...contestantScores].sort((a, b) => b.percentage - a.percentage);

        // Assign ranks based on percentage
        let rank = 1;
        let previousPercentage = null;
        let sameRankCount = 0;

        sortedForRanking.forEach((contestant, index) => {
            if (previousPercentage !== null && contestant.percentage < previousPercentage) {
                rank += sameRankCount;
                sameRankCount = 1;
            } else if (previousPercentage === contestant.percentage) {
                sameRankCount++;
            } else {
                sameRankCount = 1;
            }
            
            previousPercentage = contestant.percentage;
            contestant.rank = rank;
        });

        // Create a rank map
        const rankMap = {};
        sortedForRanking.forEach(contestant => {
            rankMap[contestant.id] = contestant.rank;
        });

        // Return contestants sorted by sequence number with their ranks
        return contestantScores
            .map(contestant => ({
                ...contestant,
                rank: rankMap[contestant.id]
            }))
            .sort((a, b) => a.sequence_no - b.sequence_no);
    };

    // Get rank badge color
    const getRankBadgeColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-red-500 text-white';
            case 2:
                return 'bg-green-500 text-white';
            case 3:
                return 'bg-blue-500 text-white';
            case 4:
                return 'bg-sky-400 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0 px-4 py-6 bg-gray-50">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Event Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-2" />
                                Select Event
                            </label>
                            <select
                                value={selectedEvent || ''}
                                onChange={(e) => {
                                    setSelectedEvent(e.target.value);
                                    setSelectedRound(null);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Select Event --</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>
                                        {event.event_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Round Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-2" />
                                Select Round
                            </label>
                            <select
                                value={selectedRound || ''}
                                onChange={(e) => setSelectedRound(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedEvent}
                            >
                                <option value="">-- Select Round --</option>
                                {rounds.map(round => (
                                    <option key={round.id} value={round.round_no}>
                                        Round {round.round_no}{round.is_active ? ' (Active)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedEvent && selectedRound && (
                        <button
                            onClick={() => fetchRoundData(selectedEvent, selectedRound)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Data
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 bg-gray-50">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600 text-lg">Loading data...</p>
                    </div>
                )}

                {/* Judges Score Tables */}
                {!loading && selectedEvent && selectedRound && judges.length > 0 && (
                    <div className="space-y-8 py-4">
                    {judges.map(judge => {
                        const rankings = getJudgeRankings(judge.id);

                        return (
                            <div key={judge.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-300">
                                {/* Judge Header */}
                                <div className="bg-gray-800 text-white px-6 py-3">
                                    <h2 className="text-xl font-bold">{judge.name}</h2>
                                </div>

                                {/* Score Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-800">
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    No
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    Contestant
                                                </th>
                                                {criteria.map(criterion => (
                                                    <th
                                                        key={criterion.id}
                                                        className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300"
                                                    >
                                                        <div>{criterion.criteria_desc}</div>
                                                        <div className="text-xs text-gray-600 font-normal normal-case mt-1">
                                                            ({criterion.percentage}%)
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    Total Score
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    Total Percentage
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase">
                                                    Rank
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rankings.map((ranking) => (
                                                <tr
                                                    key={ranking.id}
                                                    className="border-b border-gray-300 hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3 border-r border-gray-300">
                                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                                            <span className="text-black-500">{ranking.sequence_no}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-gray-300">
                                                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <span>{ranking.name}</span>
                                                        </div>
                                                    </td>
                                                    {criteria.map(criterion => {
                                                        const score = getScore(judge.id, ranking.id, criterion.id);
                                                        const hasScore = parseFloat(score) > 0;
                                                        
                                                        return (
                                                            <td
                                                                key={criterion.id}
                                                                className={`px-4 py-3 text-center border-r border-gray-300 ${
                                                                    hasScore ? 'bg-yellow-300' : ''
                                                                }`}
                                                            >
                                                                <span className="text-gray-900 font-medium">
                                                                    {score}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="px-4 py-3 text-center border-r border-gray-300">
                                                        <span className="font-bold text-gray-900">
                                                            {ranking.totalScore.toFixed(2)}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center border-r border-gray-300">
                                                        <span className="font-bold text-gray-900">
                                                            {ranking.percentage.toFixed(2)}%
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 text-center ${getRankBadgeColor(ranking.rank)}`}>
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-sm font-bold flex items-center gap-1">
                                                                <span>{ranking.rank}</span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

                {/* No Data State */}
                {!loading && selectedEvent && selectedRound && judges.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Award className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
                        <p className="text-gray-600">
                            No judges or scores found for the selected event and round.
                        </p>
                    </div>
                )}

                {/* Initial State */}
                {!loading && (!selectedEvent || !selectedRound) && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Filter className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Event and Round</h3>
                        <p className="text-gray-600">
                            Please select an event and round to view the score tables and rankings.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoreTables;
