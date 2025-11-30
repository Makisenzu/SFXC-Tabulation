import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';

export default function MedalTally({ tallies: initialTallies }) {
    const [tallies, setTallies] = useState(initialTallies || []);
    const [selectedTally, setSelectedTally] = useState(null);

    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel('medal-tally-public');
            
            channel.listen('.MedalTallyUpdated', (data) => {
                fetchLatestTallies();
            });

            return () => {
                window.Echo.leave('medal-tally-public');
            };
        }
    }, []);

    const fetchLatestTallies = async () => {
        try {
            const response = await fetch('/api/medal-tallies');
            const data = await response.json();
            setTallies(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (tallies.length > 0 && !selectedTally) {
            setSelectedTally(tallies[0]);
        }
    }, [tallies]);

    const getMedalIcon = (score) => {
        const medalSVG = (color) => (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="15" r="6" fill={color} stroke="#6B7280" strokeWidth="1.5"/>
                <path d="M9 9L7 2M15 9L17 2M7 2L9 2M17 2L15 2" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        );

        switch (parseInt(score)) {
            case 3:
                return (
                    <div className="inline-flex items-center gap-2">
                        {medalSVG('#FFD700')}
                        <span className="text-sm font-medium text-gray-700">Gold</span>
                    </div>
                );
            case 2:
                return (
                    <div className="inline-flex items-center gap-2">
                        {medalSVG('#C0C0C0')}
                        <span className="text-sm font-medium text-gray-700">Silver</span>
                    </div>
                );
            case 1:
                return (
                    <div className="inline-flex items-center gap-2">
                        {medalSVG('#CD7F32')}
                        <span className="text-sm font-medium text-gray-700">Bronze</span>
                    </div>
                );
            default:
                return <span className="text-sm text-gray-400">-</span>;
        }
    };

    const calculateMedalCounts = (participantId) => {
        if (!selectedTally) return { gold: 0, silver: 0, bronze: 0, total: 0 };
        const scores = selectedTally.scores.filter(s => s.participant_id === participantId);
        const gold = scores.filter(s => s.score === 3).length;
        const silver = scores.filter(s => s.score === 2).length;
        const bronze = scores.filter(s => s.score === 1).length;
        return {
            gold,
            silver,
            bronze,
            total: gold + silver + bronze
        };
    };

    const getSortedParticipants = () => {
        if (!selectedTally) return [];
        return [...selectedTally.participants].sort((a, b) => {
            const countsA = calculateMedalCounts(a.id);
            const countsB = calculateMedalCounts(b.id);
            
            if (countsB.gold !== countsA.gold) return countsB.gold - countsA.gold;
            if (countsB.silver !== countsA.silver) return countsB.silver - countsA.silver;
            if (countsB.bronze !== countsA.bronze) return countsB.bronze - countsA.bronze;
            return 0;
        });
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-400 text-yellow-900'; // Gold/Yellow for 1st
            case 2:
                return 'bg-blue-400 text-blue-900'; // Blue for 2nd
            case 3:
                return 'bg-red-400 text-red-900'; // Red for 3rd
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    const getParticipantColor = (participantName) => {
        const name = participantName.toUpperCase();
        if (name.includes('CBE')) {
            return 'border-l-4 border-yellow-500 bg-yellow-50';
        } else if (name.includes('CTE')) {
            return 'border-l-4 border-blue-700 bg-blue-100';
        } else if (name.includes('CCJE')) {
            return 'border-l-4 border-red-500 bg-red-50';
        }
        return 'border-l-4 border-gray-300';
    };

    return (
        <PublicLayout>
            <Head title="Medal Tally" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900">Medal Tally</h1>
                            <p className="text-gray-600 mt-1">Competition standings and results</p>
                        </div>
                    </div>

                    {tallies.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">No medal tally available</p>
                        </div>
                    ) : (
                        <>
                            {tallies.length > 1 && (
                                <div className="mb-6">
                                    <select
                                        value={selectedTally?.id || ''}
                                        onChange={(e) => setSelectedTally(tallies.find(t => t.id === parseInt(e.target.value)))}
                                        className="block w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                                    >
                                        {tallies.map(tally => (
                                            <option key={tally.id} value={tally.id}>{tally.tally_title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedTally && (
                                <>
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                                        <div className="p-6 border-b border-gray-200">
                                            <h2 className="text-2xl font-semibold text-gray-900">{selectedTally.tally_title}</h2>
                                            <p className="text-gray-600 mt-1">{selectedTally.events.length} Competitions</p>
                                        </div>
                                        
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Standings</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {getSortedParticipants().map((participant, index) => {
                                                    const counts = calculateMedalCounts(participant.id);
                                                    const rank = index + 1;
                                                    return (
                                                        <div key={participant.id} className={`rounded-lg p-5 border border-gray-200 ${getParticipantColor(participant.participant_name)}`}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="font-semibold text-gray-900">{participant.participant_name}</h4>
                                                                {counts.total > 0 && (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                                                                        Rank {rank}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <circle cx="12" cy="15" r="6" fill="#FFD700" stroke="#6B7280" strokeWidth="1.5"/>
                                                                            <path d="M9 9L7 2M15 9L17 2M7 2L9 2M17 2L15 2" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                                                                        </svg>
                                                                        <span className="text-sm text-gray-600">Gold</span>
                                                                    </div>
                                                                    <span className="text-lg font-semibold text-gray-900">{counts.gold}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <circle cx="12" cy="15" r="6" fill="#C0C0C0" stroke="#6B7280" strokeWidth="1.5"/>
                                                                            <path d="M9 9L7 2M15 9L17 2M7 2L9 2M17 2L15 2" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                                                                        </svg>
                                                                        <span className="text-sm text-gray-600">Silver</span>
                                                                    </div>
                                                                    <span className="text-lg font-semibold text-gray-900">{counts.silver}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <circle cx="12" cy="15" r="6" fill="#CD7F32" stroke="#6B7280" strokeWidth="1.5"/>
                                                                            <path d="M9 9L7 2M15 9L17 2M7 2L9 2M17 2L15 2" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                                                                        </svg>
                                                                        <span className="text-sm text-gray-600">Bronze</span>
                                                                    </div>
                                                                    <span className="text-lg font-semibold text-gray-900">{counts.bronze}</span>
                                                                </div>
                                                                <div className="pt-3 mt-3 border-t border-gray-200">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-gray-900">Total</span>
                                                                        <span className="text-xl font-semibold text-gray-900">{counts.total}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900">Competition Results</h3>
                                        </div>
                                        
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Competition
                                                        </th>
                                                        {selectedTally.participants.map(p => (
                                                            <th key={p.id} className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                {p.participant_name}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {selectedTally.events.map((event) => (
                                                        <tr key={event.id}>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                                {event.event_name}
                                                            </td>
                                                            {selectedTally.participants.map(p => {
                                                                const score = selectedTally.scores.find(s => s.event_id === event.id && s.participant_id === p.id);
                                                                return (
                                                                    <td key={p.id} className="px-6 py-4 text-center">
                                                                        {getMedalIcon(score?.score)}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}