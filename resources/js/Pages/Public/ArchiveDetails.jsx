import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ArchiveDetails({ event, rankings, archivedAt }) {
    const isOnlineVersion = window.location.hostname.includes('sfxcresults.online') || 
                           window.location.hostname.includes('herokuapp') ||
                           !window.location.hostname.includes('localhost');
    
    const getMedalStyle = (rank) => {
        switch (rank) {
            case 1: 
                return {
                    bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
                    border: 'border-yellow-600',
                    text: 'text-yellow-900',
                    shadow: 'shadow-yellow-200',
                    glow: 'shadow-2xl'
                };
            case 2: 
                return {
                    bg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
                    border: 'border-gray-600',
                    text: 'text-gray-900',
                    shadow: 'shadow-gray-200',
                    glow: 'shadow-xl'
                };
            case 3: 
                return {
                    bg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
                    border: 'border-orange-600',
                    text: 'text-orange-900',
                    shadow: 'shadow-orange-200',
                    glow: 'shadow-lg'
                };
            default: 
                return {
                    bg: 'bg-white',
                    border: 'border-gray-300',
                    text: 'text-gray-700',
                    shadow: 'shadow-gray-100',
                    glow: 'shadow'
                };
        }
    };

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
            
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/archives" className="text-white hover:text-indigo-200 mb-4 inline-flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Archives
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{event.event_name}</h1>
                    {event.description && (
                        <p className="text-indigo-100 text-lg mb-4">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-indigo-100">
                        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
                            {event.event_type}
                        </span>
                        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
                            {formatDate(event.event_start)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Winners Section */}
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isOnlineVersion ? '🏆 Official Winners 🏆' : 'Final Results'}
                        </h2>
                        <p className="text-gray-600">
                            {isOnlineVersion 
                                ? 'Congratulations to our top performers!'
                                : `${displayRankings.length} ${displayRankings.length === 1 ? 'contestant' : 'contestants'} competed`
                            }
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        {displayRankings.map((ranking, index) => {
                            const style = getMedalStyle(ranking.rank);
                            const isTopThree = ranking.rank <= 3;
                            
                            return (
                                <div 
                                    key={ranking.contestant_id} 
                                    className={`
                                        relative overflow-hidden
                                        ${isTopThree ? 'transform hover:scale-102 transition-transform duration-300' : ''}
                                    `}
                                >
                                    <div className={`
                                        bg-white rounded-2xl border-2 ${style.border}
                                        ${style.glow} ${style.shadow}
                                        p-6 md:p-8
                                        ${isTopThree ? 'ring-4 ring-opacity-50 ring-' + (ranking.rank === 1 ? 'yellow' : ranking.rank === 2 ? 'gray' : 'orange') + '-300' : ''}
                                    `}>
                                        <div className="flex items-center gap-6">
                                            {/* Rank Badge */}
                                            <div className={`
                                                relative flex-shrink-0
                                                w-20 h-20 md:w-24 md:h-24 
                                                rounded-full ${style.bg}
                                                flex items-center justify-center
                                                border-4 border-white
                                                ${style.glow}
                                            `}>
                                                {isTopThree && (
                                                    <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
                                                )}
                                                <div className="text-4xl md:text-5xl font-black text-white relative z-10">
                                                    {ranking.rank === 1 ? '🥇' : ranking.rank === 2 ? '🥈' : ranking.rank === 3 ? '🥉' : ranking.rank}
                                                </div>
                                            </div>

                                            {/* Contestant Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-3 mb-2">
                                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                                                        {ranking.contestant_name}
                                                    </h3>
                                                    {isTopThree && (
                                                        <span className={`
                                                            px-3 py-1 rounded-full text-xs font-semibold
                                                            ${ranking.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                                                              ranking.rank === 2 ? 'bg-gray-100 text-gray-800' : 
                                                              'bg-orange-100 text-orange-800'}
                                                        `}>
                                                            {ranking.rank === 1 ? 'CHAMPION' : 
                                                             ranking.rank === 2 ? 'RUNNER-UP' : 
                                                             '2ND RUNNER-UP'}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className="text-gray-600 font-medium">
                                                    {ranking.rank === 1 ? '1st Place' : 
                                                     ranking.rank === 2 ? '2nd Place' : 
                                                     ranking.rank === 3 ? '3rd Place' : 
                                                     `${ranking.rank}th Place`}
                                                </p>
                                            </div>

                                            {/* Score (Local Only) */}
                                            {!isOnlineVersion && (
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-3xl md:text-4xl font-black text-gray-900">
                                                        {ranking.total_score}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                                        Points
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Decorative Elements for Top 3 */}
                                        {isTopThree && (
                                            <>
                                                <div className={`
                                                    absolute top-0 right-0 w-32 h-32 
                                                    ${style.bg} opacity-5 rounded-bl-full
                                                `}></div>
                                                <div className={`
                                                    absolute bottom-0 left-0 w-24 h-24 
                                                    ${style.bg} opacity-5 rounded-tr-full
                                                `}></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Note */}
                    {isOnlineVersion && rankings.length > 3 && (
                        <div className="mt-12 text-center">
                            <p className="text-gray-500 text-sm">
                                Showing top 3 winners • {rankings.length - 3} other {rankings.length - 3 === 1 ? 'contestant' : 'contestants'} participated
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
