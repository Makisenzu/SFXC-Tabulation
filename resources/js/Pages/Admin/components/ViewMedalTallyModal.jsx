import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaMedal, FaPrint } from 'react-icons/fa';

export default function ViewMedalTallyModal({ tally, onClose, onUpdate }) {
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializeScores();
    }, [tally]);

    const initializeScores = () => {
        const initialScores = {};
        tally.scores?.forEach(score => {
            const key = `${score.event_id}_${score.participant_id}`;
            if (!initialScores[key]) {
                initialScores[key] = [];
            }
            initialScores[key].push({
                id: score.id,
                score: score.score
            });
        });
        setScores(initialScores);
    };

    const handleScoreChange = async (eventId, participantId, medalIndex, value) => {
        const numValue = parseInt(value);
        const key = `${eventId}_${participantId}`;
        
        if (value === '') {
            // Delete the medal
            const currentScores = scores[key] || [];
            if (currentScores[medalIndex]?.id) {
                setLoading(true);
                try {
                    await axios.delete(`/deleteMedalScore/${currentScores[medalIndex].id}`);
                    const newScores = currentScores.filter((_, idx) => idx !== medalIndex);
                    setScores(prev => ({
                        ...prev,
                        [key]: newScores
                    }));
                    onUpdate();
                } catch (error) {
                    console.error('Error deleting score:', error);
                    alert('Failed to delete score');
                } finally {
                    setLoading(false);
                }
            }
        } else if (numValue >= 1 && numValue <= 3) {
            setLoading(true);
            try {
                const response = await axios.post('/updateMedalScore', {
                    medal_tally_id: tally.id,
                    event_id: eventId,
                    participant_id: participantId,
                    score: numValue,
                    score_id: scores[key]?.[medalIndex]?.id || null
                });
                
                const currentScores = scores[key] || [];
                const newScores = [...currentScores];
                newScores[medalIndex] = {
                    id: response.data.score.id,
                    score: numValue
                };
                
                setScores(prev => ({
                    ...prev,
                    [key]: newScores
                }));
                onUpdate();
            } catch (error) {
                console.error('Error updating score:', error);
                alert('Failed to update score');
            } finally {
                setLoading(false);
            }
        }
    };

    const addMedalSlot = (eventId, participantId) => {
        const key = `${eventId}_${participantId}`;
        const currentScores = scores[key] || [];
        setScores(prev => ({
            ...prev,
            [key]: [...currentScores, { id: null, score: '' }]
        }));
    };

    const getScores = (eventId, participantId) => {
        const key = `${eventId}_${participantId}`;
        return scores[key] || [];
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
        tally.events?.forEach(event => {
            const eventScores = getScores(event.id, participantId);
            eventScores.forEach(scoreObj => {
                if (scoreObj.score) {
                    stats.total++;
                    switch (parseInt(scoreObj.score)) {
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
        });
        return stats;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl flex flex-col max-h-[95vh]">
                {/* Fixed Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-200 gap-3">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{tally.tally_title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {tally.events?.length} Competitions • {tally.participants?.length} Participants
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => window.open(`/printFullMedalTally/${tally.id}`, '_blank')}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            title="Print Full Tally"
                        >
                            <FaPrint size={16} />
                            <span className="hidden sm:inline">Full Tally</span>
                        </button>
                        <button
                            onClick={() => window.open(`/printCueCards/${tally.id}`, '_blank')}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            title="Print Cue Cards"
                        >
                            <FaPrint size={16} />
                            <span className="hidden sm:inline">Cue Cards</span>
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Medal Statistics - Fixed at Top */}
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {tally.participants?.map(participant => {
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
                            <strong>How to score:</strong> Enter 1 for Bronze, 2 for Silver, or 3 for Gold. Click "+ Add Medal" to give multiple medals to same participant. Scores are saved automatically.
                        </p>
                    </div>

                    {/* Scrollable Scoring Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 shadow-sm">
                                            Competition
                                        </th>
                                        {tally.participants?.map(participant => (
                                            <th key={participant.id} className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px] sm:min-w-[180px]">
                                                <div className="truncate">{participant.participant_name}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tally.events?.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 shadow-sm min-w-[150px] sm:min-w-[200px]">
                                                <div className="line-clamp-2">{event.event_name}</div>
                                            </td>
                                            {tally.participants?.map(participant => {
                                                const participantScores = getScores(event.id, participant.id);
                                                const hasScores = participantScores.length > 0;
                                                
                                                return (
                                                    <td key={participant.id} className="px-3 sm:px-6 py-4">
                                                        <div className="flex flex-col items-center gap-2">
                                                            {participantScores.map((scoreObj, idx) => {
                                                                const medal = getMedalType(scoreObj.score);
                                                                return (
                                                                    <div key={idx} className="flex flex-col items-center gap-1 w-full">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max="3"
                                                                            value={scoreObj.score || ''}
                                                                            onChange={(e) => handleScoreChange(event.id, participant.id, idx, e.target.value)}
                                                                            className="w-14 sm:w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                                                );
                                                            })}
                                                            {(!hasScores || participantScores.every(s => s.score)) && (
                                                                <button
                                                                    onClick={() => addMedalSlot(event.id, participant.id)}
                                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
                                                                >
                                                                    + Add Medal
                                                                </button>
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

                {/* Fixed Footer */}
                <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm sm:text-base"
                    >
                        Close
                    </button>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <div className="text-gray-600">Saving...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
