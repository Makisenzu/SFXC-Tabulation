import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FaMedal, FaTrophy } from 'react-icons/fa';

export default function Archives({ archivedEvents, archivedMedalTallies }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <PublicLayout>
            <Head title="Archives" />
            
            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Archives</h1>

                    {/* Medal Tally Archives Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <FaTrophy className="text-2xl text-gray-700" />
                            <h2 className="text-2xl font-bold text-gray-900">Medal Tally Archives</h2>
                        </div>

                        {archivedMedalTallies && archivedMedalTallies.length === 0 ? (
                            <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
                                <p className="text-gray-500">No archived medal tallies</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {archivedMedalTallies?.map(tally => {
                                    const goldCount = tally.scores?.filter(s => s.score === 3).length || 0;
                                    const silverCount = tally.scores?.filter(s => s.score === 2).length || 0;
                                    const bronzeCount = tally.scores?.filter(s => s.score === 1).length || 0;

                                    return (
                                        <Link
                                            key={tally.id}
                                            href={`/archived-medal-tallies/${tally.id}`}
                                            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 block"
                                        >
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tally.tally_title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Archived on {formatDate(tally.archived_at)}
                                                </p>
                                            </div>

                                            {/* <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                                <span>{tally.events?.length || 0} competitions</span>
                                                <span>{tally.participants?.length || 0} participants</span>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <FaMedal className="text-yellow-500" />
                                                    <span className="font-bold text-gray-900">{goldCount}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaMedal className="text-gray-400" />
                                                    <span className="font-bold text-gray-900">{silverCount}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaMedal className="text-orange-600" />
                                                    <span className="font-bold text-gray-900">{bronzeCount}</span>
                                                </div>
                                            </div> */}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Event Archives Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900">Event Archives</h2>
                        </div>

                        {archivedEvents.length === 0 ? (
                            <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
                                <p className="text-gray-500">No archived events</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {archivedEvents.map(event => (
                                    <Link
                                        key={event.id}
                                        href={`/archives/${event.id}`}
                                        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 block"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{event.event_name}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>{event.event_type}</span>
                                                    <span>{event.contestants?.length || 0} contestants</span>
                                                    <span>{formatDate(event.event_start)}</span>
                                                </div>
                                            </div>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
