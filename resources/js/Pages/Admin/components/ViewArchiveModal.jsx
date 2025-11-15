import React, { useState } from 'react';
import { FaTimes, FaTrophy, FaMedal } from 'react-icons/fa';

export default function ViewArchiveModal({ archiveData, onClose }) {
    const [selectedTab, setSelectedTab] = useState('rankings');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRankBadge = (rank) => {
        const badges = {
            1: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🥇', label: '1st Place' },
            2: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '🥈', label: '2nd Place' },
            3: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🥉', label: '3rd Place' }
        };
        
        return badges[rank] || { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🏅', label: `${rank}th Place` };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-6xl my-8">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{archiveData.event.event_name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p><strong>Type:</strong> {archiveData.event.event_type}</p>
                            <p><strong>Description:</strong> {archiveData.event.description}</p>
                            <p><strong>Event Period:</strong> {new Date(archiveData.event.event_start).toLocaleDateString()} - {new Date(archiveData.event.event_end).toLocaleDateString()}</p>
                            <p><strong>Archived:</strong> {formatDate(archiveData.archived_at)}</p>
                        </div>
                        {archiveData.notes && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm"><strong>Notes:</strong> {archiveData.notes}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex gap-4 px-6">
                        <button
                            onClick={() => setSelectedTab('rankings')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                                selectedTab === 'rankings'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <FaTrophy />
                                Final Rankings
                            </div>
                        </button>
                        <button
                            onClick={() => setSelectedTab('details')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                                selectedTab === 'details'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <FaMedal />
                                Detailed Scores
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {selectedTab === 'rankings' && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Final Rankings</h4>
                            <div className="space-y-3">
                                {archiveData.rankings.map((ranking) => {
                                    const badge = getRankBadge(ranking.rank);
                                    return (
                                        <div key={ranking.contestant_id} className={`p-4 rounded-lg border-2 ${badge.color}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{badge.icon}</span>
                                                    <div>
                                                        <h5 className="font-bold text-lg">{ranking.contestant_name}</h5>
                                                        <p className="text-sm opacity-75">{badge.label}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">{ranking.total_score}</div>
                                                    <div className="text-sm opacity-75">Total Score</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'details' && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Detailed Scores by Contestant</h4>
                            <div className="space-y-6">
                                {archiveData.archive_data.contestants.map((contestant) => (
                                    <div key={contestant.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h5 className="font-bold text-lg text-gray-900">
                                                {contestant.name}
                                            </h5>
                                            <p className="text-sm text-gray-500">Sequence #{contestant.sequence_no}</p>
                                        </div>
                                        
                                        <div className="p-4">
                                            {contestant.rounds && contestant.rounds.length > 0 ? (
                                                <div className="space-y-4">
                                                    {contestant.rounds.map((round, roundIdx) => (
                                                        <div key={roundIdx} className="bg-white border border-gray-200 rounded p-3">
                                                            <h6 className="font-semibold text-sm text-gray-700 mb-2">
                                                                Round {round.round_no}
                                                            </h6>
                                                            {round.scores && round.scores.length > 0 ? (
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full text-sm">
                                                                        <thead className="bg-gray-50">
                                                                            <tr>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                                    Criteria
                                                                                </th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                                                    Judge
                                                                                </th>
                                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                                                    Score
                                                                                </th>
                                                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                                                    Weight
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-200">
                                                                            {round.scores.map((score, scoreIdx) => (
                                                                                <tr key={scoreIdx}>
                                                                                    <td className="px-3 py-2 text-gray-900">
                                                                                        {score.criteria}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 text-gray-600">
                                                                                        {score.judge}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 text-right font-semibold text-gray-900">
                                                                                        {score.score}
                                                                                    </td>
                                                                                    <td className="px-3 py-2 text-right text-gray-600">
                                                                                        {score.percentage}%
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic">No scores recorded for this round</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No rounds recorded for this contestant</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
