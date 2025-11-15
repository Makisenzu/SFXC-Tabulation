import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaMedal } from 'react-icons/fa';

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
                setLoading(true);
                try {
                    await axios.post('/updateMedalScore', {
                        medal_tally_id: tally.id,
                        event_id: eventId,
                        participant_id: participantId,
                        score: numValue
                    });
                    onUpdate();
                } catch (error) {
                    console.error('Error updating score:', error);
                    alert('Failed to update score');
                } finally {
                    setLoading(false);
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
        tally.events?.forEach(event => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-6xl my-8">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{tally.tally_title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {tally.events?.length} Competitions • {tally.participants?.length} Participants
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Medal Statistics */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tally.participants?.map(participant => {
                            const stats = getMedalStats(participant.id);
                            return (
                                <div key={participant.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-gray-900 mb-2 truncate">{participant.participant_name}</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FaMedal className="text-yellow-500" size={14} />
                                            <span>Gold: {stats.gold}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaMedal className="text-gray-400" size={14} />
                                            <span>Silver: {stats.silver}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaMedal className="text-orange-600" size={14} />
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
                        <p className="text-sm text-blue-800">
                            <strong>How to score:</strong> Enter 1 for Bronze, 2 for Silver, or 3 for Gold. Scores are saved automatically.
                        </p>
                    </div>

                    {/* Scoring Table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                                        Competition
                                    </th>
                                    {tally.participants?.map(participant => (
                                        <th key={participant.id} className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            {participant.participant_name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tally.events?.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                                            {event.event_name}
                                        </td>
                                        {tally.participants?.map(participant => {
                                            const score = getScore(event.id, participant.id);
                                            const medal = getMedalType(score);
                                            
                                            return (
                                                <td key={participant.id} className="px-6 py-4">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="3"
                                                            value={score}
                                                            onChange={(e) => handleScoreChange(event.id, participant.id, e.target.value)}
                                                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="-"
                                                        />
                                                        {medal && (
                                                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${medal.bg}`}>
                                                                <FaMedal className={medal.color} size={14} />
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

                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
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
