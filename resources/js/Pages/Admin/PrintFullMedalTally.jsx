import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PrintFullMedalTally({ tally }) {
    useEffect(() => {
        window.print();
    }, []);

    const calculateMedalCounts = (participantId) => {
        const scores = tally.scores.filter(s => s.participant_id === participantId);
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
        return [...tally.participants].sort((a, b) => {
            const countsA = calculateMedalCounts(a.id);
            const countsB = calculateMedalCounts(b.id);
            
            if (countsB.gold !== countsA.gold) return countsB.gold - countsA.gold;
            if (countsB.silver !== countsA.silver) return countsB.silver - countsA.silver;
            if (countsB.bronze !== countsA.bronze) return countsB.bronze - countsA.bronze;
            return 0;
        });
    };

    const getMedalIcon = (eventId, participantId) => {
        const medals = tally.scores.filter(s => s.event_id === eventId && s.participant_id === participantId);
        if (medals.length === 0) return '-';
        
        return medals.map((medal, idx) => {
            switch (parseInt(medal.score)) {
                case 3:
                    return <span key={idx} className="inline-block mx-0.5">🥇</span>;
                case 2:
                    return <span key={idx} className="inline-block mx-0.5">🥈</span>;
                case 1:
                    return <span key={idx} className="inline-block mx-0.5">🥉</span>;
                default:
                    return null;
            }
        });
    };

    const getParticipantColor = (participantName) => {
        const name = participantName.toUpperCase();
        if (name.includes('CBE')) {
            return 'border-l-4 border-yellow-500 bg-yellow-50';
        } else if (name.includes('CTE')) {
            return 'border-l-4 border-blue-600 bg-blue-50';
        } else if (name.includes('CCJE')) {
            return 'border-l-4 border-red-500 bg-red-50';
        }
        return 'border-l-4 border-gray-300';
    };

    return (
        <>
            <Head title={`${tally.tally_title} - Medal Tally`} />
            
            <style>{`
                @media print {
                    body { 
                        margin: 0;
                        padding: 20px;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 15mm;
                    }
                    .no-print {
                        display: none;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                }
                
                body {
                    font-family: Arial, sans-serif;
                }
            `}</style>

            <div className="max-w-full mx-auto p-8 bg-white">
                {/* Header */}
                <div className="text-center mb-8 border-b-4 border-gray-800 pb-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{tally.tally_title}</h1>
                    <p className="text-xl text-gray-600">Complete Medal Tally Report</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {tally.events?.length} Competitions • {tally.participants?.length} Participants
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Generated on {new Date().toLocaleString()}
                    </p>
                </div>

                {/* Overall Standings */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                        Overall Medal Standings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getSortedParticipants().map((participant, index) => {
                            const counts = calculateMedalCounts(participant.id);
                            const rank = index + 1;
                            return (
                                <div
                                    key={participant.id}
                                    className={`rounded-lg p-4 border ${getParticipantColor(participant.participant_name)}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-lg">{participant.participant_name}</h3>
                                        {counts.total > 0 && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-800 text-white">
                                                #{rank}
                                            </span>
                                        )}
                                    </div>

                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-1">🥇 Gold</td>
                                                <td className="py-1 text-right font-semibold">{counts.gold}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-1">🥈 Silver</td>
                                                <td className="py-1 text-right font-semibold">{counts.silver}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-1">🥉 Bronze</td>
                                                <td className="py-1 text-right font-semibold">{counts.bronze}</td>
                                            </tr>
                                            <tr className="font-bold">
                                                <td className="py-1 pt-2">Total Medals</td>
                                                <td className="py-1 pt-2 text-right">{counts.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detailed Results Table */}
                <div className="page-break">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                        Detailed Competition Results
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                                        Competition
                                    </th>
                                    {tally.participants.map(p => (
                                        <th key={p.id} className="border border-gray-300 px-4 py-3 text-center font-bold">
                                            {p.participant_name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tally.events.map((event, idx) => (
                                    <tr key={event.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border border-gray-300 px-4 py-3 font-semibold">
                                            {event.event_name}
                                        </td>
                                        {tally.participants.map(p => (
                                            <td key={p.id} className="border border-gray-300 px-4 py-3 text-center text-2xl">
                                                {getMedalIcon(event.id, p.id)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
                    <p>SFXC Tabulation System - Medal Tally Report</p>
                    <p>Rankings are based on Gold medals first, then Silver, then Bronze</p>
                </div>

                {/* Print Button */}
                <div className="no-print mt-6 text-center">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Print This Report
                    </button>
                    <button
                        onClick={() => window.close()}
                        className="ml-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
