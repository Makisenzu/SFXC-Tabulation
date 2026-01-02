import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FaMedal, FaArrowLeft, FaTrophy } from 'react-icons/fa';

export default function ArchivedMedalTallyEventDetails({ tally, event, results }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getMedalColor = (medalType) => {
        switch(medalType) {
            case 'Gold': return 'text-yellow-500';
            case 'Silver': return 'text-gray-400';
            case 'Bronze': return 'text-orange-600';
            default: return 'text-gray-400';
        }
    };

    const sortedResults = [...results].sort((a, b) => {
        const getTopMedalScore = (medals) => {
            const scores = medals.map(m => m.score);
            return Math.max(...scores);
        };
        return getTopMedalScore(b.medals) - getTopMedalScore(a.medals);
    });

    const winner = sortedResults.length > 0 ? sortedResults[0] : null;

    return (
        <PublicLayout>
            <Head title={`${event.event_name} - ${tally.tally_title}`} />
            
            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        href={`/archived-medal-tallies/${tally.id}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <FaArrowLeft /> Back to {tally.tally_title}
                    </Link>

                    {/* Event Header */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.event_name}</h1>
                        <p className="text-gray-600">
                            {formatDate(event.event_start)} - {formatDate(event.event_end)}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                            Part of: {tally.tally_title}
                        </p>
                    </div>

                    {/* Winner Spotlight */}
                    {winner && (
                        <div className="bg-white rounded-lg shadow border-2 border-gray-900 p-8 mb-8">
                            <div className="text-center">
                                <FaTrophy className="text-6xl text-gray-900 mx-auto mb-4" />
                                <div className="text-xl text-gray-600 font-semibold mb-2">CHAMPION</div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    {winner.participant}
                                </h2>
                                <div className="flex justify-center gap-4 flex-wrap">
                                    {winner.medals.map((medal, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
                                            <FaMedal className={`${getMedalColor(medal.type)} text-2xl`} />
                                            <span className="font-bold text-gray-900">{medal.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Results */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Medal Winners</h2>

                        {sortedResults.length === 0 ? (
                            <div className="text-center py-12">
                                <FaMedal className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No medals awarded for this event</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sortedResults.map((result, index) => (
                                    <div 
                                        key={index}
                                        className={`p-6 rounded-lg border ${
                                            index === 0 
                                                ? 'bg-gray-50 border-gray-900 border-2' 
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`text-3xl font-bold ${
                                                    index === 0 ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        {result.participant}
                                                        {index === 0 && <FaTrophy className="text-gray-900" />}
                                                    </h3>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {result.medals.length} medal{result.medals.length !== 1 ? 's' : ''} won
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {result.medals.map((medal, mIdx) => (
                                                    <div 
                                                        key={mIdx}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white"
                                                    >
                                                        <FaMedal className={`${getMedalColor(medal.type)} text-xl`} />
                                                        <span className="font-bold text-gray-900">{medal.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <Link
                            href={`/archived-medal-tallies/${tally.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <FaArrowLeft /> View All Competitions
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
