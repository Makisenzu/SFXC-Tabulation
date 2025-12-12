import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FaTrophy, FaCalendar, FaUsers, FaMedal, FaArchive } from 'react-icons/fa';

export default function Archives({ archivedEvents }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getEventTypeColor = (type) => {
        const colors = {
            'Pageant': 'from-pink-500 to-purple-600',
            'Sports': 'from-blue-500 to-cyan-600',
            'Cultural': 'from-green-500 to-teal-600',
            'Academic': 'from-yellow-500 to-orange-600',
            'default': 'from-indigo-500 to-purple-600'
        };
        return colors[type] || colors.default;
    };

    return (
        <PublicLayout>
            <Head title="Event Archives" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <FaArchive className="mx-auto text-6xl mb-4 opacity-90" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Archives</h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Browse through past competitions and view the winners who made history
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {archivedEvents.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                            <FaArchive className="mx-auto text-gray-300 text-6xl mb-4" />
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Archived Events Yet</h3>
                            <p className="text-gray-500">Check back later for completed competitions and their results</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {archivedEvents.length} {archivedEvents.length === 1 ? 'Event' : 'Events'} Archived
                                </h2>
                                <p className="text-gray-600 mt-1">Click on any event to view the winners and detailed results</p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {archivedEvents.map(event => (
                                    <Link
                                        key={event.id}
                                        href={`/archives/${event.id}`}
                                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                    >
                                        {/* Event Header with Gradient */}
                                        <div className={`bg-gradient-to-r ${getEventTypeColor(event.event_type)} p-6 relative`}>
                                            <div className="absolute top-0 right-0 p-4">
                                                <FaTrophy className="text-white text-3xl opacity-20" />
                                            </div>
                                            <div className="relative z-10">
                                                <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs font-semibold text-white mb-3">
                                                    {event.event_type}
                                                </span>
                                                <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                                                    {event.event_name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Event Details */}
                                        <div className="p-6">
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                                {event.description || 'View the complete results and winners of this competition'}
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <FaCalendar className="mr-3 text-indigo-600" />
                                                    <span className="font-medium">{formatDate(event.event_start)}</span>
                                                </div>
                                                
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <FaUsers className="mr-3 text-indigo-600" />
                                                    <span>
                                                        {event.contestants?.length || 0} 
                                                        {' '}{event.contestants?.length === 1 ? 'Contestant' : 'Contestants'}
                                                    </span>
                                                </div>

                                                {event.medal_tally_name && (
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <FaMedal className="mr-3 text-yellow-600" />
                                                        <span className="font-medium text-purple-700">
                                                            {event.medal_tally_name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* View Results Button */}
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between text-indigo-600 group-hover:text-indigo-700">
                                                    <span className="font-semibold text-sm">View Winners</span>
                                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
