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

    const getMedalBadge = (score) => {
        switch (parseInt(score)) {
            case 3:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        Gold
                    </span>
                );
            case 2:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-300 to-gray-500 text-white">
                        Silver
                    </span>
                );
            case 1:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                        Bronze
                    </span>
                );
            default:
                return <span className="text-gray-400 text-xs">-</span>;
        }
    };

    const calculateMedalCounts = (participantId) => {
        if (!selectedTally) return { gold: 0, silver: 0, bronze: 0 };
        const scores = selectedTally.scores.filter(s => s.participant_id === participantId);
        return {
            gold: scores.filter(s => s.score === 3).length,
            silver: scores.filter(s => s.score === 2).length,
            bronze: scores.filter(s => s.score === 1).length
        };
    };

    return (
        <PublicLayout>
            <Head title="Medal Tally" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Medal Tally</h1>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Live
                        </div>
                    </div>

                    {tallies.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <p className="text-gray-500">No medal tally available</p>
                        </div>
                    ) : (
                        <>
                            {tallies.length > 1 && (
                                <select
                                    value={selectedTally?.id || ''}
                                    onChange={(e) => setSelectedTally(tallies.find(t => t.id === parseInt(e.target.value)))}
                                    className="mb-6 block w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {tallies.map(tally => (
                                        <option key={tally.id} value={tally.id}>{tally.tally_title}</option>
                                    ))}
                                </select>
                            )}

                            {selectedTally && (
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                                        <h2 className="text-2xl font-bold text-white">{selectedTally.tally_title}</h2>
                                        <p className="text-blue-100 mt-1">{selectedTally.events.length} Competitions</p>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                                        Competition
                                                    </th>
                                                    {selectedTally.participants.map(p => (
                                                        <th key={p.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                                            {p.participant_name}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedTally.events.map(event => (
                                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                            {event.event_name}
                                                        </td>
                                                        {selectedTally.participants.map(p => {
                                                            const score = selectedTally.scores.find(s => s.event_id === event.id && s.participant_id === p.id);
                                                            return (
                                                                <td key={p.id} className="px-6 py-4 text-center">
                                                                    {getMedalBadge(score?.score)}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                                                    <td className="px-6 py-4 text-sm text-gray-900">Total Medals</td>
                                                    {selectedTally.participants.map(p => {
                                                        const counts = calculateMedalCounts(p.id);
                                                        return (
                                                            <td key={p.id} className="px-6 py-4 text-center">
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
                                                                        <span className="text-sm font-bold">{counts.gold}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-500"></span>
                                                                        <span className="text-sm font-bold">{counts.silver}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></span>
                                                                        <span className="text-sm font-bold">{counts.bronze}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
