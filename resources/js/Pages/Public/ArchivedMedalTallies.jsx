import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FaMedal, FaArchive } from 'react-icons/fa';

export default function ArchivedMedalTallies({ tallies }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <PublicLayout>
            <Head title="Archived Medal Tallies" />
            
            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Archived Medal Tallies</h1>
                        <p className="text-gray-600">View past medal tally results and winners</p>
                    </div>

                    {tallies.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <FaArchive className="mx-auto text-6xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No archived medal tallies</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {tallies.map(tally => {
                                const totalMedals = tally.scores?.length || 0;
                                const goldCount = tally.scores?.filter(s => s.score === 3).length || 0;
                                const silverCount = tally.scores?.filter(s => s.score === 2).length || 0;
                                const bronzeCount = tally.scores?.filter(s => s.score === 1).length || 0;

                                return (
                                    <Link
                                        key={tally.id}
                                        href={`/archived-medal-tallies/${tally.id}`}
                                        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{tally.tally_title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Archived on {formatDate(tally.archived_at)}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">Competitions</div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {tally.events?.length || 0}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">Participants</div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {tally.participants?.length || 0}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm font-semibold text-gray-700 mb-3">Medal Distribution</div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center">
                                                    <FaMedal className="text-yellow-500 text-xl mx-auto mb-1" />
                                                    <div className="text-lg font-bold text-gray-900">{goldCount}</div>
                                                    <div className="text-xs text-gray-600">Gold</div>
                                                </div>
                                                <div className="text-center">
                                                    <FaMedal className="text-gray-400 text-xl mx-auto mb-1" />
                                                    <div className="text-lg font-bold text-gray-900">{silverCount}</div>
                                                    <div className="text-xs text-gray-600">Silver</div>
                                                </div>
                                                <div className="text-center">
                                                    <FaMedal className="text-orange-600 text-xl mx-auto mb-1" />
                                                    <div className="text-lg font-bold text-gray-900">{bronzeCount}</div>
                                                    <div className="text-xs text-gray-600">Bronze</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500 text-right">
                                            Click to view details →
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
