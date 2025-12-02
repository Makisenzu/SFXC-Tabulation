import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PrintCueCards({ tally }) {
    useEffect(() => {
        window.print();
    }, []);

    const getMedalIcon = (score) => {
        switch (parseInt(score)) {
            case 3:
                return { emoji: '🥇', text: 'GOLD', color: 'text-yellow-600 bg-yellow-50 border-yellow-400' };
            case 2:
                return { emoji: '🥈', text: 'SILVER', color: 'text-gray-600 bg-gray-50 border-gray-400' };
            case 1:
                return { emoji: '🥉', text: 'BRONZE', color: 'text-orange-600 bg-orange-50 border-orange-400' };
            default:
                return null;
        }
    };

    const getEventWinners = (event) => {
        const eventScores = tally.scores.filter(s => s.event_id === event.id);
        const winners = {
            champion: [],
            first: [],
            second: []
        };

        eventScores.forEach(score => {
            const participant = tally.participants.find(p => p.id === score.participant_id);
            if (participant && score.score >= 1 && score.score <= 3) {
                if (score.score === 3) {
                    winners.champion.push(participant.participant_name);
                } else if (score.score === 2) {
                    winners.first.push(participant.participant_name);
                } else if (score.score === 1) {
                    winners.second.push(participant.participant_name);
                }
            }
        });

        return winners;
    };

    const calculateMedalCounts = (participantId) => {
        const scores = tally.scores.filter(s => s.participant_id === participantId);
        const gold = scores.filter(s => s.score === 3).length;
        const silver = scores.filter(s => s.score === 2).length;
        const bronze = scores.filter(s => s.score === 1).length;
        return { gold, silver, bronze, total: gold + silver + bronze };
    };

    const getParticipantColor = (participantName) => {
        const name = participantName.toUpperCase();
        if (name.includes('CBE')) {
            return 'border-yellow-500 bg-yellow-50';
        } else if (name.includes('CTE')) {
            return 'border-blue-600 bg-blue-50';
        } else if (name.includes('CCJE')) {
            return 'border-red-500 bg-red-50';
        }
        return 'border-gray-300 bg-gray-50';
    };

    return (
        <>
            <Head title={`${tally.tally_title} - Cue Cards`} />
            
            <style>{`
                @media print {
                    body { 
                        margin: 0;
                        padding: 0;
                    }
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    .no-print {
                        display: none;
                    }
                    .cue-card {
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    .cue-card:last-child {
                        page-break-after: auto;
                    }
                }
                
                body {
                    font-family: Arial, sans-serif;
                }
                
                .cue-card {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }
            `}</style>

            <div className="max-w-full">
                {/* Print Control */}
                <div className="no-print p-8 bg-gray-100 text-center border-b-4 border-blue-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tally.tally_title}</h1>
                    <p className="text-lg text-gray-600 mb-4">Cue Cards - One per Competition</p>
                    <p className="text-sm text-gray-500 mb-6">
                        {tally.events?.length} cards will be printed
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Print Cue Cards
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Cue Cards */}
                {tally.events.map((event, eventIndex) => {
                    const winners = getEventWinners(event);
                    
                    return (
                        <div key={event.id} className="cue-card bg-white">
                            {/* Card Header */}
                            <div className="text-center mb-8 pb-4 border-b-4 border-gray-800">
                                <div className="text-sm text-gray-500 mb-2">
                                    {tally.tally_title}
                                </div>
                                <h1 className="text-5xl font-bold text-gray-900 mb-2">
                                    {event.event_name}
                                </h1>
                                <div className="text-lg text-gray-600">
                                    Competition #{eventIndex + 1} of {tally.events.length}
                                </div>
                            </div>

                            {/* Winners Section */}
                            <div className="flex-1 space-y-8 mb-8">
                                {/* 2nd Place */}
                                <div className="border-l-8 border-orange-500 bg-orange-50 rounded-r-2xl p-6">
                                    <div className="text-xl font-semibold text-orange-700 mb-1">2nd PLACE:</div>
                                    <div className="text-4xl font-bold text-gray-900">
                                        {winners.second.length > 0 ? winners.second.join(', ') : '___________________'}
                                    </div>
                                </div>

                                {/* 1st Place */}
                                <div className="border-l-8 border-gray-500 bg-gray-50 rounded-r-2xl p-6">
                                    <div className="text-xl font-semibold text-gray-700 mb-1">1st PLACE:</div>
                                    <div className="text-4xl font-bold text-gray-900">
                                        {winners.first.length > 0 ? winners.first.join(', ') : '___________________'}
                                    </div>
                                </div>

                                {/* Champion */}
                                <div className="border-l-8 border-yellow-500 bg-yellow-50 rounded-r-2xl p-6">
                                    <div className="text-xl font-semibold text-yellow-700 mb-1">CHAMPION:</div>
                                    <div className="text-4xl font-bold text-gray-900">
                                        {winners.champion.length > 0 ? winners.champion.join(', ') : '___________________'}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="border-t-4 border-gray-800 pt-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                    OVERALL MEDAL SUMMARY
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {tally.participants.map(participant => {
                                        const counts = calculateMedalCounts(participant.id);
                                        return (
                                            <div
                                                key={participant.id}
                                                className="bg-white border-2 border-gray-300 rounded-lg p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-2xl font-bold text-gray-900">
                                                        {participant.participant_name}
                                                    </h3>
                                                    <div className="flex items-center gap-6 text-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">🥇</span>
                                                            <span className="font-bold">{counts.gold}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">🥈</span>
                                                            <span className="font-bold">{counts.silver}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">🥉</span>
                                                            <span className="font-bold">{counts.bronze}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4 pl-4 border-l-2 border-gray-400">
                                                            <span className="font-semibold text-gray-600">Total:</span>
                                                            <span className="font-bold text-xl">{counts.total}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="mt-6 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
                                <p>SFXC Tabulation System</p>
                                <p className="text-xs mt-1">
                                    Generated: {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
