import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Trophy,
    Medal,
    Award,
    Filter,
    RefreshCw,
    Printer,
    FileDown,
    FileSpreadsheet,
    X,
    Download,
    ChevronDown
} from 'lucide-react';
import appLogo from '@/images/printLogo.jpg';
import axios from 'axios';

// Import Scores Modal Component
const ImportScoresModal = ({ 
    showModal, 
    setShowModal, 
    rounds, 
    selectedRound, 
    criteria, 
    contestants,
    importingScores,
    handleImportScores 
}) => {
    const [sourceRound, setSourceRound] = useState('');
    const [targetCriteriaId, setTargetCriteriaId] = useState('');
    const [selectedContestants, setSelectedContestants] = useState([]);

    const toggleContestant = (contestantId) => {
        setSelectedContestants(prev => 
            prev.includes(contestantId) 
                ? prev.filter(id => id !== contestantId)
                : [...prev, contestantId]
        );
    };

    const toggleAllContestants = () => {
        if (selectedContestants.length === contestants.length) {
            setSelectedContestants([]);
        } else {
            setSelectedContestants(contestants.map(c => c.id));
        }
    };

    const handleSubmit = () => {
        if (!sourceRound || !targetCriteriaId || selectedContestants.length === 0) {
            alert('Please select source round, target criteria, and at least one contestant');
            return;
        }
        handleImportScores(sourceRound, targetCriteriaId, selectedContestants);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Import Scores from Previous Round
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Calculate and import weighted average scores
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            disabled={importingScores}
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 space-y-6">
                    {/* Step 1: Select Source Round */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            1. Select Previous Round
                        </label>
                        <select
                            value={sourceRound}
                            onChange={(e) => setSourceRound(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                            disabled={importingScores}
                        >
                            <option value="">Choose a round to import from</option>
                            {rounds
                                .filter(round => round.round_no < selectedRound)
                                .map(round => (
                                    <option key={round.round_no} value={round.round_no}>
                                        Round {round.round_no}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Step 2: Select Target Criteria */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            2. Select Target Criteria (Current Round {selectedRound})
                        </label>
                        <select
                            value={targetCriteriaId}
                            onChange={(e) => setTargetCriteriaId(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                            disabled={importingScores}
                        >
                            <option value="">Choose criteria to populate</option>
                            {criteria.map(criterion => (
                                <option key={criterion.id} value={criterion.id}>
                                    {criterion.criteria_desc} ({criterion.percentage}%)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Step 3: Select Contestants */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                3. Select Contestants
                            </label>
                            <button
                                onClick={toggleAllContestants}
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                disabled={importingScores}
                            >
                                {selectedContestants.length === contestants.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="border-2 border-gray-200 rounded-xl max-h-64 overflow-y-auto">
                            {contestants.map(contestant => (
                                <label
                                    key={contestant.id}
                                    className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedContestants.includes(contestant.id)}
                                        onChange={() => toggleContestant(contestant.id)}
                                        disabled={importingScores}
                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-900">
                                        {contestant.contestant_name}
                                    </span>
                                </label>
                            ))}
                            {contestants.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No contestants available
                                </p>
                            )}
                        </div>
                        {selectedContestants.length > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                {selectedContestants.length} contestant(s) selected
                            </p>
                        )}
                    </div>

                    {/* Info Box */}
                    {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">
                                    How this works:
                                </p>
                                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                                    <li>Calculates weighted scores from all criteria in the source round</li>
                                    <li>Averages scores across all judges</li>
                                    <li>Converts to a rating score (0-10 scale)</li>
                                    <li>Imports the same calculated score for all judges</li>
                                </ul>
                            </div>
                        </div>
                    </div> */}

                    {/* Warning Box */}
                    {/* <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <Award className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-yellow-900">
                                    Warning
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Existing scores for the selected criteria will be overwritten. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl sticky bottom-0">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white transition-colors"
                            disabled={importingScores}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={importingScores || !sourceRound || !targetCriteriaId || selectedContestants.length === 0}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {importingScores ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Import Scores
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [generalData, setGeneralData] = useState([]);
    const [showSpecialAwardsModal, setShowSpecialAwardsModal] = useState(false);
    const [specialAwardsData, setSpecialAwardsData] = useState([]);
    const [showCriteriaDropdown, setShowCriteriaDropdown] = useState(false);
    const [editingScore, setEditingScore] = useState(null);
    const [tempScore, setTempScore] = useState('');
    const dropdownRef = useRef(null);
    const [showImportScoresModal, setShowImportScoresModal] = useState(false);
    const [importingScores, setImportingScores] = useState(false);
    const [showPastEvents, setShowPastEvents] = useState(false);
    const [eventsPagination, setEventsPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [customLogo, setCustomLogo] = useState(appLogo);

    // Fetch custom logo on component mount
    useEffect(() => {
        fetch('/api/settings/logo')
            .then(res => res.json())
            .then(data => {
                if (data.logo) {
                    setCustomLogo(`/storage/${data.logo}`);
                }
            })
            .catch(err => console.error('Error loading custom logo:', err));
    }, []);

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents(1);
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

    // Setup real-time listener for score updates
    useEffect(() => {
        console.log('🔍 Broadcasting setup check:', {
            selectedEvent,
            selectedRound,
            hasEcho: !!window.Echo,
            echoType: window.Echo?.constructor?.name
        });

        if (selectedEvent && selectedRound && window.Echo) {
            const channelName = `score-updates.${selectedEvent}.${selectedRound}`;
            
            console.log('🟡 Attempting to subscribe to:', channelName);

            try {
                const channel = window.Echo.private(channelName)
                    .listen('.score.updated', (event) => {
                        console.log('🟢 Score update received:', event);
                        
                        // Update the specific score in the scores array
                        if (event.score) {
                            updateSingleScore(event.score);
                        }
                    });

                console.log('✅ Successfully subscribed to channel:', channelName);

                // Cleanup on unmount or when event/round changes
                return () => {
                    console.log('🔴 Leaving channel:', channelName);
                    window.Echo.leave(channelName);
                };
            } catch (error) {
                console.error('❌ Failed to subscribe to channel:', error);
            }
        } else {
            console.warn('⚠️ Cannot subscribe - missing:', {
                selectedEvent: !!selectedEvent,
                selectedRound: !!selectedRound,
                windowEcho: !!window.Echo
            });
        }
    }, [selectedEvent, selectedRound]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCriteriaDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update a single score in the state
    const updateSingleScore = (scoreData) => {
        setScores(prevScores => {
            const updatedScores = [...prevScores];
            
            // Find existing score index
            const existingIndex = updatedScores.findIndex(
                s => s.judge_id === scoreData.judge_id && 
                     s.contestant_id === scoreData.contestant_id && 
                     s.criteria_id === scoreData.criteria_id
            );

            const newScore = {
                id: scoreData.tabulation_id,
                judge_id: scoreData.judge_id,
                contestant_id: scoreData.contestant_id,
                criteria_id: scoreData.criteria_id,
                score: scoreData.score,
                is_lock: scoreData.is_lock
            };

            if (existingIndex >= 0) {
                // Update existing score
                updatedScores[existingIndex] = newScore;
            } else {
                // Add new score
                updatedScores.push(newScore);
            }

            console.log('✅ Score updated in state:', newScore);
            return updatedScores;
        });
    };

    const fetchEvents = async (page = 1) => {
        try {
            setLoading(true);
            // Always fetch all events, we'll filter on the frontend
            const response = await fetch(`/getEvents?page=${page}&per_page=100&show_past=true`);
            const data = await response.json();
            
            // Handle paginated response
            if (data.data && Array.isArray(data.data)) {
                setEvents(data.data);
                setEventsPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    per_page: data.per_page,
                    total: data.total
                });
            } else {
                // Fallback for non-paginated response
                const processedEvents = Array.isArray(data) ? data : data?.events || data?.data || [];
                setEvents(processedEvents);
            }
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

    // Notify judge to enter scores
    const notifyJudge = async (judgeId, judgeName) => {
        try {
            const response = await axios.post('/admin/notify-judge', {
                judge_id: judgeId,
                event_id: selectedEvent,
                round_no: selectedRound,
                message: 'Please enter your scores as soon as possible.'
            });
            
            if (response.data.success) {
                alert(`Notification sent to ${judgeName} successfully!`);
            } else {
                alert('Failed to send notification. Please try again.');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            console.error('Error response:', error.response?.data);
            alert(`Failed to send notification: ${error.response?.data?.message || error.message}`);
        }
    };

    // Handle score cell click for editing
    const handleScoreCellClick = (judgeId, contestantId, criteriaId, currentScore) => {
        setEditingScore({ judgeId, contestantId, criteriaId });
        setTempScore(currentScore === '0.00' ? '' : currentScore);
    };

    // Handle score input change
    const handleScoreInputChange = (e) => {
        const value = e.target.value;
        // Allow empty or valid decimal numbers between 0 and 10
        if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 10)) {
            setTempScore(value);
        }
    };

    // Handle score update submission
    const handleScoreUpdate = async (judgeId, contestantId, criteriaId) => {
        const scoreValue = parseFloat(tempScore) || 0;
        
        if (scoreValue < 0 || scoreValue > 10) {
            alert('Score must be between 0 and 10');
            return;
        }

        try {
            const response = await axios.post('/admin/update-score', {
                judge_id: judgeId,
                contestant_id: contestantId,
                criteria_id: criteriaId,
                event_id: selectedEvent,
                round_no: selectedRound,
                score: scoreValue
            });

            if (response.data.success) {
                // Update local state immediately
                const updatedScore = {
                    id: response.data.tabulation.id,
                    judge_id: judgeId,
                    contestant_id: contestantId,
                    criteria_id: criteriaId,
                    score: scoreValue,
                    is_lock: response.data.tabulation.is_lock
                };

                setScores(prevScores => {
                    const existingIndex = prevScores.findIndex(
                        s => s.judge_id === judgeId && 
                             s.contestant_id === contestantId && 
                             s.criteria_id === criteriaId
                    );

                    if (existingIndex >= 0) {
                        const newScores = [...prevScores];
                        newScores[existingIndex] = updatedScore;
                        return newScores;
                    } else {
                        return [...prevScores, updatedScore];
                    }
                });

                setEditingScore(null);
                setTempScore('');
            }
        } catch (error) {
            console.error('Error updating score:', error);
            alert(`Failed to update score: ${error.response?.data?.message || error.message}`);
        }
    };

    // Handle clicking outside the input to cancel editing
    const handleScoreBlur = () => {
        setEditingScore(null);
        setTempScore('');
    };

    // Handle Enter key to submit, Escape to cancel
    const handleScoreKeyDown = (e, judgeId, contestantId, criteriaId) => {
        if (e.key === 'Enter') {
            handleScoreUpdate(judgeId, contestantId, criteriaId);
        } else if (e.key === 'Escape') {
            handleScoreBlur();
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

    // Handle import scores with weighted calculation
    const handleImportScores = async (sourceRound, targetCriteriaId, selectedContestantIds) => {
        if (!selectedEvent || !selectedRound || !targetCriteriaId || selectedContestantIds.length === 0) {
            alert('Please select target criteria and at least one contestant');
            return;
        }
        
        if (window.confirm(`Import weighted scores from Round ${sourceRound} to selected criteria? This will calculate and import aggregated scores for ${selectedContestantIds.length} contestant(s).`)) {
            setImportingScores(true);
            try {
                const response = await axios.post('/admin/import-scores', {
                    event_id: selectedEvent,
                    source_round_no: sourceRound,
                    target_round_no: selectedRound,
                    target_criteria_id: targetCriteriaId,
                    contestant_ids: selectedContestantIds,
                });

                if (response.data.success) {
                    alert(response.data.message);
                    setShowImportScoresModal(false);
                    // Refresh the data to show imported scores
                    await fetchRoundData(selectedEvent, selectedRound);
                } else {
                    alert(response.data.message || 'Failed to import scores');
                }
            } catch (error) {
                console.error('Error importing scores:', error);
                alert(`Failed to import scores: ${error.response?.data?.message || error.message}`);
            } finally {
                setImportingScores(false);
            }
        }
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

    // Print General Tabulated Result
    const printGeneralTabulation = () => {
        // Debug: Check data availability
        console.log('Print Debug:', {
            contestants: contestants.length,
            judges: judges.length,
            criteria: criteria.length,
            scores: scores.length,
            contestantsData: contestants
        });

        if (contestants.length === 0) {
            alert('No contestants data available. Please select an event and round first.');
            return;
        }

        if (judges.length === 0) {
            alert('No judges data available. Please ensure judges are assigned to this event.');
            return;
        }

        // Calculate general tabulation data
        const data = contestants.map(contestant => {
            console.log('Processing contestant:', contestant);
            
            const judgeData = judges.map(judge => {
                const judgeScores = scores.filter(
                    s => s.judge_id === judge.id && s.contestant_id === contestant.id
                );

                // Calculate percentage for this judge
                let totalPercentage = 0;
                criteria.forEach(criterion => {
                    const score = judgeScores.find(s => s.criteria_id === criterion.id);
                    if (score && score.score) {
                        const weightValue = parseInt(criterion.percentage) / 100;
                        totalPercentage += (parseFloat(score.score) / 10) * weightValue * 100;
                    }
                });

                return {
                    judgeId: judge.id,
                    judgeName: judge.name,
                    percentage: totalPercentage
                };
            });

            // Calculate average percentage across all judges
            const avgPercentage = judgeData.length > 0
                ? judgeData.reduce((sum, j) => sum + j.percentage, 0) / judgeData.length
                : 0;

            return {
                id: contestant.id,
                sequence_no: contestant.sequence_no || 0,
                name: contestant.contestant_name || contestant.name || 'Unknown',
                judgeData,
                avgPercentage
            };
        });

        console.log('General Data:', data);

        // Calculate ranks for each judge
        judges.forEach(judge => {
            const sortedByJudge = [...data].sort((a, b) => {
                const aPercentage = a.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                const bPercentage = b.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                return bPercentage - aPercentage;
            });

            let rank = 1;
            let previousPercentage = null;
            let sameRankCount = 0;

            sortedByJudge.forEach((contestant, index) => {
                const judgePercentage = contestant.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                
                if (previousPercentage !== null && judgePercentage < previousPercentage) {
                    rank += sameRankCount;
                    sameRankCount = 1;
                } else if (previousPercentage === judgePercentage) {
                    sameRankCount++;
                } else {
                    sameRankCount = 1;
                }
                
                previousPercentage = judgePercentage;
                
                const judgeDataItem = contestant.judgeData.find(j => j.judgeId === judge.id);
                if (judgeDataItem) {
                    judgeDataItem.rank = rank;
                }
            });
        });

        // Calculate overall ranks based on average percentage
        const sortedByAvg = [...data].sort((a, b) => b.avgPercentage - a.avgPercentage);
        
        let rank = 1;
        let previousPercentage = null;
        let sameRankCount = 0;

        sortedByAvg.forEach((contestant, index) => {
            if (previousPercentage !== null && contestant.avgPercentage < previousPercentage) {
                rank += sameRankCount;
                sameRankCount = 1;
            } else if (previousPercentage === contestant.avgPercentage) {
                sameRankCount++;
            } else {
                sameRankCount = 1;
            }
            
            previousPercentage = contestant.avgPercentage;
            contestant.overallRank = rank;
        });

        // Sort by overall rank for display
        data.sort((a, b) => a.overallRank - b.overallRank);

        // Set data and show modal
        setGeneralData(data);
        setShowPrintModal(true);
    };

    // Generate special awards data for specific criteria
    const generateCriteriaAward = (criterionId) => {
        const criterion = criteria.find(c => c.id === criterionId);
        if (!criterion) return;

        // Calculate data for each contestant
        const data = contestants.map(contestant => {
            const judgeData = judges.map(judge => {
                const score = scores.find(
                    s => s.judge_id === judge.id && 
                         s.contestant_id === contestant.id && 
                         s.criteria_id === criterion.id
                );
                
                const rawScore = score ? parseFloat(score.score || 0) : 0;
                // Convert score to percentage with criteria weight: (score / 10) * criteria_percentage
                const criteriaWeight = parseInt(criterion.percentage) / 100;
                const percentage = (rawScore / 10) * criteriaWeight * 100;
                
                return {
                    judgeId: judge.id,
                    judgeName: judge.name,
                    score: rawScore,
                    percentage: percentage
                };
            });

            // Calculate average percentage
            const totalPercentage = judgeData.reduce((sum, j) => sum + j.percentage, 0);
            const avgPercentage = judgeData.length > 0 ? totalPercentage / judgeData.length : 0;

            return {
                id: contestant.id,
                sequence_no: contestant.sequence_no,
                name: contestant.contestant_name,
                judgeData,
                avgPercentage
            };
        });

        // Calculate ranks for each judge
        judges.forEach(judge => {
            const sortedByJudge = [...data].sort((a, b) => {
                const aPercentage = a.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                const bPercentage = b.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                return bPercentage - aPercentage;
            });

            let rank = 1;
            let previousPercentage = null;
            let sameRankCount = 0;

            sortedByJudge.forEach((contestant) => {
                const judgePercentage = contestant.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                
                if (previousPercentage !== null && judgePercentage < previousPercentage) {
                    rank += sameRankCount;
                    sameRankCount = 1;
                } else if (previousPercentage === judgePercentage) {
                    sameRankCount++;
                } else {
                    sameRankCount = 1;
                }
                
                previousPercentage = judgePercentage;
                
                const judgeDataItem = contestant.judgeData.find(j => j.judgeId === judge.id);
                if (judgeDataItem) {
                    judgeDataItem.rank = rank;
                }
            });
        });

        // Calculate overall ranks based on average percentage
        const sortedByAvg = [...data].sort((a, b) => b.avgPercentage - a.avgPercentage);
        
        let rank = 1;
        let previousPercentage = null;
        let sameRankCount = 0;

        sortedByAvg.forEach((contestant) => {
            if (previousPercentage !== null && contestant.avgPercentage < previousPercentage) {
                rank += sameRankCount;
                sameRankCount = 1;
            } else if (previousPercentage === contestant.avgPercentage) {
                sameRankCount++;
            } else {
                sameRankCount = 1;
            }
            
            previousPercentage = contestant.avgPercentage;
            contestant.overallRank = rank;
        });

        // Sort by sequence number for display
        data.sort((a, b) => a.sequence_no - b.sequence_no);

        const awardData = {
            criteriaId: criterion.id,
            criteriaName: criterion.criteria_name || criterion.criteria_desc,
            percentage: criterion.percentage,
            contestants: data
        };

        setSpecialAwardsData([awardData]);
        setShowSpecialAwardsModal(true);
        setShowCriteriaDropdown(false);
    };

    // Export functions
    const exportToCSV = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;
        
        let csv = `General Tabulated Result\n\n`;
        
        // Headers
        csv += 'NO,CONTESTANT,';
        judges.forEach(judge => {
            csv += `${judge.name} % SCORE,${judge.name} RANK,`;
        });
        csv += 'AVG PERCENTAGE,RANK\n';
        
        // Data rows
        generalData.forEach((contestant, index) => {
            csv += `${index + 1},${contestant.name},`;
            contestant.judgeData.forEach(judge => {
                csv += `${judge.percentage.toFixed(2)}%,${judge.rank},`;
            });
            csv += `${contestant.avgPercentage.toFixed(2)}%,${contestant.overallRank}\n`;
        });
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `General_Tabulated_Result.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToExcel = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;
        
        let html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>General Results</x:Name>
                                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
            </head>
            <body>
                <table>
                    <tr><td colspan="${2 + (judges.length * 2) + 2}"><b>General Tabulated Result</b></td></tr>
                    <tr></tr>
                    <tr>
                        <th>NO</th>
                        <th>CONTESTANT</th>
                        ${judges.map(judge => `<th>${judge.name} % SCORE</th><th>${judge.name} RANK</th>`).join('')}
                        <th>AVG PERCENTAGE</th>
                        <th>RANK</th>
                    </tr>
                    ${generalData.map((contestant, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${contestant.name}</td>
                            ${contestant.judgeData.map(judge => `<td>${judge.percentage.toFixed(2)}%</td><td>${judge.rank}</td>`).join('')}
                            <td>${contestant.avgPercentage.toFixed(2)}%</td>
                            <td>${contestant.overallRank}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;
        
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `General_Tabulated_Result.xls`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const printTable = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;

        // Use custom logo if available
        const logoToUse = customLogo;

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>General Tabulated Result</title>
                <style>
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        body {
                            page-break-inside: avoid;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        .certification-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                        .signature-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 100%;
                        position: relative;
                    }
                    .logo {
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        width: 80px;
                        height: auto;
                    }
                    .header-content {
                        text-align: center;
                        margin-bottom: 30px;
                        overflow: hidden;
                    }
                    h1 {
                        text-align: center;
                        font-size: 20px;
                        margin: 0;
                        padding-top: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 4px 6px;
                        text-align: center;
                    }
                    th {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <img src="${logoToUse}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>GENERAL TABULATED RESULT</h1>
                </div>
                <div style="clear: both;"></div>
                
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">NO</th>
                            <th rowspan="2">CONTESTANT</th>
                            ${judges.map(judge => `
                                <th colspan="2">${judge.name.toUpperCase()}</th>
                            `).join('')}
                            <th rowspan="2">AVG<br/>PERCENTAGE</th>
                            <th rowspan="2">FINAL RANK</th>
                        </tr>
                        <tr>
                            ${judges.map(() => `
                                <th>% SCORE</th>
                                <th>RANK</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${generalData.length === 0 ? `
                            <tr>
                                <td colspan="${2 + (judges.length * 2) + 2}" style="text-align: center; padding: 20px;">
                                    No data available
                                </td>
                            </tr>
                        ` : generalData.map((contestant, index) => {
                            // Get rank color
                            let rankColor = '#d1d5db'; // gray for others
                            if (contestant.overallRank === 1) rankColor = '#ef4444'; // red
                            else if (contestant.overallRank === 2) rankColor = '#22c55e'; // green
                            else if (contestant.overallRank === 3) rankColor = '#3b82f6'; // blue
                            else if (contestant.overallRank === 4) rankColor = '#38bdf8'; // sky
                            
                            return `
                            <tr>
                                <td style="background-color: ${rankColor}; color: white; font-weight: bold;">${contestant.sequence_no}</td>
                                <td style="text-align: left; padding-left: 10px;"><strong>${contestant.name}</strong></td>
                                ${contestant.judgeData.map(judge => `
                                    <td>${judge.percentage.toFixed(2)}%</td>
                                    <td><strong>${judge.rank}</strong></td>
                                `).join('')}
                                <td><strong>${contestant.avgPercentage.toFixed(2)}%</strong></td>
                                <td style="background-color: ${rankColor}; color: white; font-weight: bold;">
                                    ${contestant.overallRank}
                                </td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                
                <!-- Certification Statement -->
                <div class="certification-section" style="margin-top: 20px; text-align: center; font-style: italic; font-size: 12px;">
                    <p style="margin: 5px 0;">We hereby certify that the above results are true and correct.</p>
                </div>
                
                <!-- Signature Section -->
                <div class="signature-section" style="margin-top: 20px; display: flex; justify-content: space-around; flex-wrap: wrap;">
                    ${judges.map(judge => `
                        <div style="text-align: center; margin: 10px; min-width: 180px;">
                            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 8px auto; height: 40px;"></div>
                            <div style="font-weight: bold; font-size: 12px;">${judge.name.toUpperCase()}</div>
                            <div style="font-size: 10px; color: #666;">Signature</div>
                        </div>
                    `).join('')}
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const printSpecialAwards = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;

        // Use custom logo if available
        const logoToUse = customLogo;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Special Awards</title>
                <style>
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        body {
                            page-break-inside: avoid;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        .certification-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                        .signature-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 100%;
                        position: relative;
                    }
                    .logo {
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        width: 80px;
                        height: auto;
                    }
                    .header-content {
                        text-align: center;
                        margin-bottom: 30px;
                        overflow: hidden;
                    }
                    h1 {
                        text-align: center;
                        font-size: 20px;
                        margin: 0;
                        padding-top: 10px;
                    }
                    h2 {
                        text-align: center;
                        font-size: 18px;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 4px 6px;
                        text-align: center;
                    }
                    th {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <img src="${logoToUse}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>SPECIAL AWARDS</h1>
                </div>
                <div style="clear: both;"></div>
                
                ${specialAwardsData.map(award => `
                    <h2 style="text-align: center; margin: 20px 0 15px 0; font-size: 16px;">Best in ${award.criteriaName}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th rowspan="2">NO</th>
                                <th rowspan="2">CONTESTANT</th>
                                ${judges.map(judge => `
                                    <th colspan="2">${judge.name.toUpperCase()}</th>
                                `).join('')}
                                <th rowspan="2">AVG<br/>PERCENTAGE</th>
                                <th rowspan="2">FINAL RANK</th>
                            </tr>
                            <tr>
                                ${judges.map(() => `
                                    <th>% SCORE</th>
                                    <th>RANK</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${award.contestants.map((contestant) => {
                                // Only winner gets color (rank 1)
                                let rankColor = '';
                                let rankStyle = '';
                                if (contestant.overallRank === 1) {
                                    rankColor = '#ef4444'; // red for winner
                                    rankStyle = `background-color: ${rankColor}; color: white; font-weight: bold;`;
                                } else {
                                    rankStyle = 'font-weight: bold;';
                                }
                                
                                return `
                                <tr>
                                    <td style="${contestant.overallRank === 1 ? rankStyle : 'font-weight: bold;'}">${contestant.sequence_no}</td>
                                    <td style="text-align: left; padding-left: 10px;"><strong>${contestant.name}</strong></td>
                                    ${contestant.judgeData.map(judge => `
                                        <td>${judge.percentage.toFixed(2)}%</td>
                                        <td><strong>${judge.rank}</strong></td>
                                    `).join('')}
                                    <td><strong>${contestant.avgPercentage.toFixed(2)}%</strong></td>
                                    <td style="${rankStyle}">
                                        ${contestant.overallRank}
                                    </td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `).join('')}
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Filter events by date
    const filteredEvents = useMemo(() => {
        if (showPastEvents) {
            return events;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return events.filter(event => {
            const eventStart = new Date(event.event_start);
            const eventEnd = new Date(event.event_end);
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(0, 0, 0, 0);

            // Show event if it starts today/future OR ends today/future
            return eventStart >= today || eventEnd >= today;
        });
    }, [events, showPastEvents]);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0 px-4 py-6 bg-gray-50">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Show Past Events Toggle */}
                    <div className="mb-4 flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showPastEvents}
                                onChange={(e) => setShowPastEvents(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                Show past events
                            </span>
                        </label>
                        
                        {/* Pagination Info */}
                        {eventsPagination.total > 0 && (
                            <span className="text-sm text-gray-500">
                                Showing {filteredEvents.length} of {events.length} events
                            </span>
                        )}
                    </div>

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
                                {filteredEvents.map(event => (
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
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={() => fetchRoundData(selectedEvent, selectedRound)}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh Data
                            </button>
                            <button
                                onClick={printGeneralTabulation}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print General Tabulated Result
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowCriteriaDropdown(!showCriteriaDropdown)}
                                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                                >
                                    <Award className="w-4 h-4 mr-2" />
                                    Special Awards
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </button>
                                {showCriteriaDropdown && criteria.length > 0 && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[250px] max-h-[300px] overflow-y-auto">
                                        {criteria.map(criterion => (
                                            <button
                                                key={criterion.id}
                                                onClick={() => generateCriteriaAward(criterion.id)}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-gray-200 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-800">
                                                    {criterion.criteria_name || criterion.criteria_desc}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedRound > 1 && (
                                <button
                                    onClick={() => setShowImportScoresModal(true)}
                                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Import Scores
                                </button>
                            )}
                        </div>
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
                                <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-300">
                                    <h2 className="text-xl font-bold text-gray-800">{judge.name}</h2>
                                    <button
                                        onClick={() => notifyJudge(judge.id, judge.name)}
                                        className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        title="Notify judge to enter scores"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                        Notify
                                    </button>
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
                                                        const isEditing = editingScore?.judgeId === judge.id && 
                                                                         editingScore?.contestantId === ranking.id && 
                                                                         editingScore?.criteriaId === criterion.id;
                                                        
                                                        return (
                                                            <td
                                                                key={criterion.id}
                                                                className={`px-4 py-3 text-center border-r border-gray-300 cursor-pointer hover:bg-blue-50 ${
                                                                    hasScore ? 'bg-yellow-300' : ''
                                                                } ${isEditing ? 'bg-blue-100' : ''}`}
                                                                onClick={() => !isEditing && handleScoreCellClick(judge.id, ranking.id, criterion.id, score)}
                                                            >
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        value={tempScore}
                                                                        onChange={handleScoreInputChange}
                                                                        onBlur={handleScoreBlur}
                                                                        onKeyDown={(e) => handleScoreKeyDown(e, judge.id, ranking.id, criterion.id)}
                                                                        className="w-16 px-2 py-1 text-center border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        autoFocus
                                                                        placeholder="0-10"
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-900 font-medium">
                                                                        {score}
                                                                    </span>
                                                                )}
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

            {/* Print Modal */}
            {showPrintModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">General Tabulated Result</h2>
                            <button
                                onClick={() => setShowPrintModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="mb-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {events.find(e => e.id == selectedEvent)?.event_name || 'Event'}
                                </h3>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-800 text-white">
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">NO</th>
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">CONTESTANT</th>
                                            {judges.map(judge => (
                                                <th key={judge.id} colSpan="2" className="border border-gray-300 px-4 py-2">
                                                    {judge.name.toUpperCase()}
                                                </th>
                                            ))}
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">AVG<br/>PERCENTAGE</th>
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">RANK</th>
                                        </tr>
                                        <tr className="bg-gray-700 text-white">
                                            {judges.map(judge => (
                                                <React.Fragment key={judge.id}>
                                                    <th className="border border-gray-300 px-4 py-2">% SCORE</th>
                                                    <th className="border border-gray-300 px-4 py-2">RANK</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generalData.length === 0 ? (
                                            <tr>
                                                <td colSpan={2 + (judges.length * 2) + 2} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : generalData.map((contestant, index) => {
                                            let rankBgColor = 'bg-gray-400';
                                            if (contestant.overallRank === 1) rankBgColor = 'bg-red-500';
                                            else if (contestant.overallRank === 2) rankBgColor = 'bg-green-500';
                                            else if (contestant.overallRank === 3) rankBgColor = 'bg-blue-500';
                                            else if (contestant.overallRank === 4) rankBgColor = 'bg-sky-400';

                                            return (
                                                <tr key={contestant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center font-bold text-white ${rankBgColor}`}>
                                                        {contestant.sequence_no}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-left font-semibold">{contestant.name}</td>
                                                    {contestant.judgeData.map(judge => (
                                                        <React.Fragment key={judge.judgeId}>
                                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                                {judge.percentage.toFixed(2)}%
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                                                                {judge.rank}
                                                            </td>
                                                        </React.Fragment>
                                                    ))}
                                                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                                                        {contestant.avgPercentage.toFixed(2)}%
                                                    </td>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center font-bold text-white ${rankBgColor}`}>
                                                        {contestant.overallRank}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                Export to CSV
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Export to Excel
                            </button>
                            <button
                                onClick={printTable}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Special Awards Modal */}
            {showSpecialAwardsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Special Awards</h2>
                            <button
                                onClick={() => setShowSpecialAwardsModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">

                            {/* Tables for each criteria */}
                            {specialAwardsData.map((award, index) => (
                                <div key={award.criteriaId} className={index > 0 ? 'mt-8' : ''}>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                                        Best in {award.criteriaName}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-white-300">
                                            <thead>
                                                <tr className="bg-white-800 text-black">
                                                    <th rowSpan="2" className="border border-gray-300 px-4 py-2">NO</th>
                                                    <th rowSpan="2" className="border border-gray-300 px-4 py-2">CONTESTANT</th>
                                                    {judges.map(judge => (
                                                        <th key={judge.id} colSpan="2" className="border border-gray-300 px-4 py-2">
                                                            {judge.name.toUpperCase()}
                                                        </th>
                                                    ))}
                                                    <th rowSpan="2" className="border border-white-300 px-4 py-2">AVG SCORE</th>
                                                    <th rowSpan="2" className="border border-white-300 px-4 py-2">FINAL RANK</th>
                                                </tr>
                                                <tr className="bg-white-700 text-black">
                                                    {judges.map(judge => (
                                                        <React.Fragment key={judge.id}>
                                                            <th className="border border-gray-300 px-4 py-2">% SCORE</th>
                                                            <th className="border border-gray-300 px-4 py-2">RANK</th>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {award.contestants.map((contestant) => {
                                                    let rankBgColor = 'bg-white-400';
                                                    if (contestant.overallRank === 1) rankBgColor = 'bg-red-500';
                                                    else if (contestant.overallRank === 2) rankBgColor = 'bg-white-500';
                                                    else if (contestant.overallRank === 3) rankBgColor = 'bg-white-500';
                                                    else if (contestant.overallRank === 4) rankBgColor = 'bg-white-400';

                                                    return (
                                                        <tr key={contestant.id} className="hover:bg-gray-50">
                                                            <td className={`border border-white-300 px-4 py-2 text-center font-bold text-black ${rankBgColor}`}>
                                                                {contestant.sequence_no}
                                                            </td>
                                                            <td className="border border-white-300 px-4 py-2 text-left font-semibold">
                                                                {contestant.name}
                                                            </td>
                                                            {contestant.judgeData.map(judge => (
                                                                <React.Fragment key={judge.judgeId}>
                                                                    <td className="border border-white-300 px-4 py-2 text-center">
                                                                        {judge.percentage.toFixed(2)}%
                                                                    </td>
                                                                    <td className="border border-white-300 px-4 py-2 text-center font-bold">
                                                                        {judge.rank}
                                                                    </td>
                                                                </React.Fragment>
                                                            ))}
                                                            <td className="border border-white-300 px-4 py-2 text-center font-bold">
                                                                {contestant.avgPercentage.toFixed(2)}%
                                                            </td>
                                                            <td className={`border border-white-300 px-4 py-2 text-center font-bold text-black ${rankBgColor}`}>
                                                                {contestant.overallRank}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setShowSpecialAwardsModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
                                    const roundNo = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;
                                    
                                    const csvContent = specialAwardsData.map(award => {
                                        const header = `\n${award.criteriaName} (${award.percentage}%)\nNO,CONTESTANT,${judges.map(j => `${j.name} % SCORE,${j.name} RANK`).join(',')},AVG PERCENTAGE,FINAL RANK\n`;
                                        const rows = award.contestants.map(c => 
                                            `${c.sequence_no},${c.name},${c.judgeData.map(j => `${j.percentage.toFixed(2)}%,${j.rank}`).join(',')},${c.avgPercentage.toFixed(2)}%,${c.overallRank}`
                                        ).join('\n');
                                        return header + rows;
                                    }).join('\n\n');

                                    const blob = new Blob([`Special Awards - ${eventName} - Round ${roundNo}\n${csvContent}`], { type: 'text/csv' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `Special_Awards_${eventName}_Round_${roundNo}.csv`;
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                Export CSV
                            </button>
                            <button
                                onClick={() => {
                                    const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
                                    const roundNo = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;
                                    
                                    let html = `
                                        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                                        <head>
                                            <meta charset="UTF-8">
                                            <!--[if gte mso 9]>
                                            <xml>
                                                <x:ExcelWorkbook>
                                                    <x:ExcelWorksheets>
                                                        <x:ExcelWorksheet>
                                                            <x:Name>Special Awards</x:Name>
                                                            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                                        </x:ExcelWorksheet>
                                                    </x:ExcelWorksheets>
                                                </x:ExcelWorkbook>
                                            </xml>
                                            <![endif]-->
                                        </head>
                                        <body>
                                            ${specialAwardsData.map(award => `
                                                <table>
                                                    <tr><td colspan="${2 + (judges.length * 2) + 2}"><b>${award.criteriaName} (${award.percentage}%)</b></td></tr>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>CONTESTANT</th>
                                                        ${judges.map(judge => `<th>${judge.name} % SCORE</th><th>${judge.name} RANK</th>`).join('')}
                                                        <th>AVG PERCENTAGE</th>
                                                        <th>FINAL RANK</th>
                                                    </tr>
                                                    ${award.contestants.map(contestant => `
                                                        <tr>
                                                            <td>${contestant.sequence_no}</td>
                                                            <td>${contestant.name}</td>
                                                            ${contestant.judgeData.map(judge => `<td>${judge.percentage.toFixed(2)}%</td><td>${judge.rank}</td>`).join('')}
                                                            <td>${contestant.avgPercentage.toFixed(2)}%</td>
                                                            <td>${contestant.overallRank}</td>
                                                        </tr>
                                                    `).join('')}
                                                </table>
                                                <br/>
                                            `).join('')}
                                        </body>
                                        </html>
                                    `;
                                    
                                    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `Special_Awards_${eventName}_Round_${roundNo}.xls`;
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Export Excel
                            </button>
                            <button
                                onClick={printSpecialAwards}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Scores Modal */}
            <ImportScoresModal
                showModal={showImportScoresModal}
                setShowModal={setShowImportScoresModal}
                rounds={rounds}
                selectedRound={selectedRound}
                criteria={criteria}
                contestants={contestants}
                importingScores={importingScores}
                handleImportScores={handleImportScores}
            />
        </div>
    );
};

export default ScoreTables;
