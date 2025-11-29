import { Head } from '@inertiajs/react';
import FacilitatorLayout from '@/Layouts/FacilitatorLayout';
import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

export default function FacilitatorDashboard() {
    const [tallies, setTallies] = useState([]);
    const [selectedTally, setSelectedTally] = useState(null);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchTallies();
    }, []);

    useEffect(() => {
        if (selectedTally) {
            initializeScores();
        }
    }, [selectedTally]);

    const fetchTallies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/facilitator/medal-tallies');
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to fetch tallies');
            }
            
            const data = await response.json();
            console.log('Tallies data:', data);
            setTallies(data);
            if (data.length > 0) {
                setSelectedTally(data[0]);
            }
        } catch (error) {
            console.error('Error fetching tallies:', error);
            alert('Error loading medal tallies: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const initializeScores = () => {
        const initialScores = {};
        selectedTally.scores?.forEach(score => {
            const key = `${score.event_id}_${score.participant_id}`;
            initialScores[key] = score.score;
        });
        setScores(initialScores);
    };

    const handleScoreChange = async (eventId, participantId, value) => {
        const numValue = parseInt(value);
        
        if (value === '' || (numValue >= 1 && numValue <= 3)) {
            const key = `${eventId}_${participantId}`;
            setScores(prev => ({
                ...prev,
                [key]: value === '' ? '' : numValue
            }));

            if (value !== '' && numValue >= 1 && numValue <= 3) {
                setUpdating(true);
                try {
                    const response = await fetch('/facilitator/update-medal-score', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        },
                        body: JSON.stringify({
                            medal_tally_id: selectedTally.id,
                            event_id: eventId,
                            participant_id: participantId,
                            score: numValue
                        }),
                    });

                    if (response.ok) {
                        await fetchTallies();
                    }
                } catch (error) {
                    console.error('Error updating score:', error);
                    alert('Failed to update score');
                } finally {
                    setUpdating(false);
                }
            }
        }
    };

    const getScore = (eventId, participantId) => {
        const key = `${eventId}_${participantId}`;
        return scores[key] || '';
    };

    const getMedalType = (score) => {
        switch (parseInt(score)) {
            case 1:
                return { type: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-50' };
            case 2:
                return { type: 'Silver', color: 'text-gray-500', bg: 'bg-gray-50' };
            case 3:
                return { type: 'Gold', color: 'text-yellow-500', bg: 'bg-yellow-50' };
            default:
                return null;
        }
    };

    const getMedalStats = (participantId) => {
        const stats = { gold: 0, silver: 0, bronze: 0, total: 0 };
        selectedTally?.events?.forEach(event => {
            const score = getScore(event.id, participantId);
            if (score) {
                stats.total++;
                switch (parseInt(score)) {
                    case 3:
                        stats.gold++;
                        break;
                    case 2:
                        stats.silver++;
                        break;
                    case 1:
                        stats.bronze++;
                        break;
                }
            }
        });
        return stats;
    };

    if (loading) {
        return (
            <FacilitatorLayout header="Medal Tally Scoring">
                <Head title="Medal Tally - Facilitator" />
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </FacilitatorLayout>
        );
    }

    return (
        <FacilitatorLayout header="Medal Tally Scoring">
            <Head title="Medal Tally - Facilitator" />

            {tallies.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                    <FaTrophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No medal tallies available</p>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {/* Tally Selector */}
                    {tallies.length > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Medal Tally
                            </label>
                            <select
                                value={selectedTally?.id || ''}
                                onChange={(e) => setSelectedTally(tallies.find(t => t.id === parseInt(e.target.value)))}
                                className="block w-full sm:max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                            >
                                {tallies.map(tally => (
                                    <option key={tally.id} value={tally.id}>{tally.tally_title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedTally && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center">
                                    <FaTrophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 sm:mr-3" />
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedTally.tally_title}</h2>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                            {selectedTally.events?.length || 0} Competitions • {selectedTally.participants?.length || 0} Participants
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-6">
                                {/* Medal Statistics */}
                                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {selectedTally.participants?.map(participant => {
                                        const stats = getMedalStats(participant.id);
                                        return (
                                            <div key={participant.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                                                <h4 className="font-semibold text-gray-900 mb-2 truncate text-sm sm:text-base">{participant.participant_name}</h4>
                                                <div className="space-y-1 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FaMedal className="text-yellow-500 flex-shrink-0" size={14} />
                                                        <span>Gold: {stats.gold}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaMedal className="text-gray-400 flex-shrink-0" size={14} />
                                                        <span>Silver: {stats.silver}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaMedal className="text-orange-600 flex-shrink-0" size={14} />
                                                        <span>Bronze: {stats.bronze}</span>
                                                    </div>
                                                    <div className="font-semibold text-blue-700 pt-1 border-t border-blue-200">
                                                        Total: {stats.total}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Scoring Instructions */}
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs sm:text-sm text-blue-800">
                                        <strong>How to score:</strong> Enter 1 for Bronze, 2 for Silver, or 3 for Gold. Scores are saved automatically.
                                    </p>
                                </div>

                                {/* Scoring Table */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 shadow-sm">
                                                        Competition
                                                    </th>
                                                    {selectedTally.participants?.map(participant => (
                                                        <th key={participant.id} className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px] sm:min-w-[150px]">
                                                            <div className="truncate">{participant.participant_name}</div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedTally.events?.map(event => (
                                                    <tr key={event.id} className="hover:bg-gray-50">
                                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 shadow-sm min-w-[150px] sm:min-w-[200px]">
                                                            <div className="line-clamp-2">{event.event_name}</div>
                                                        </td>
                                                        {selectedTally.participants?.map(participant => {
                                                            const score = getScore(event.id, participant.id);
                                                            const medal = getMedalType(score);
                                                            
                                                            return (
                                                                <td key={participant.id} className="px-3 sm:px-6 py-4">
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max="3"
                                                                            value={score}
                                                                            onChange={(e) => handleScoreChange(event.id, participant.id, e.target.value)}
                                                                            disabled={updating}
                                                                            className="w-14 sm:w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
                                                                            placeholder="-"
                                                                        />
                                                                        {medal && (
                                                                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${medal.bg}`}>
                                                                                <FaMedal className={medal.color} size={12} />
                                                                                <span className={`text-xs font-semibold ${medal.color}`}>
                                                                                    {medal.type}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {updating && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                    <div className="text-gray-600">Saving...</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </FacilitatorLayout>
    );
}
