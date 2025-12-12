import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ArchiveDetails({ event, rankings, archivedAt }) {
    const isOnlineVersion = window.location.hostname.includes('sfxcresults.online') || 
                           window.location.hostname.includes('herokuapp') ||
                           !window.location.hostname.includes('localhost');
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    // For online version, only show top 3 winners
    const displayRankings = isOnlineVersion ? rankings.slice(0, 3) : rankings;

    return (
        <PublicLayout>
            <Head title={`${event.event_name} - Results`} />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link 
                        href="/archives" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Archives
                    </Link>

                    {/* Event Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            {event.event_name}
                        </h1>
                        {event.description && (
                            <p className="text-gray-600 mb-4">{event.description}</p>
                        )}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>{event.event_type}</span>
                            <span>•</span>
                            <span>{formatDate(event.event_start)}</span>
                            {event.contestants?.length > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{event.contestants.length} contestants</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Winners Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isOnlineVersion ? 'Winners' : 'Final Results'}
                        </h2>
                        {isOnlineVersion && rankings.length > 3 && (
                            <p className="text-gray-600 mt-1 text-sm">
                                Top 3 winners
                            </p>
                        )}
                    </div>

                    {/* Winners List */}
                    <div className="space-y-4">
                        {displayRankings.map((ranking) => (
                            <div 
                                key={ranking.contestant_id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    {/* Rank */}
                                    <div className="flex-shrink-0">
                                        {ranking.rank === 1 && (
                                            <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-400 flex items-center justify-center">
                                                <span className="text-3xl">🥇</span>
                                            </div>
                                        )}
                                        {ranking.rank === 2 && (
                                            <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-gray-400 flex items-center justify-center">
                                                <span className="text-3xl">🥈</span>
                                            </div>
                                        )}
                                        {ranking.rank === 3 && (
                                            <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-400 flex items-center justify-center">
                                                <span className="text-3xl">🥉</span>
                                            </div>
                                        )}
                                        {ranking.rank > 3 && (
                                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-700">{ranking.rank}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Name and Position */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {ranking.contestant_name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {ranking.rank === 1 ? '1st Place' : 
                                             ranking.rank === 2 ? '2nd Place' : 
                                             ranking.rank === 3 ? '3rd Place' : 
                                             `${ranking.rank}th Place`}
                                        </p>
                                    </div>

                                    {/* Score (Local Only) */}
                                    {!isOnlineVersion && (
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {ranking.total_score}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                points
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    {isOnlineVersion && rankings.length > 3 && (
                        <div className="mt-8 text-center text-sm text-gray-500">
                            {rankings.length - 3} other contestant{rankings.length - 3 !== 1 ? 's' : ''} participated in this event
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
