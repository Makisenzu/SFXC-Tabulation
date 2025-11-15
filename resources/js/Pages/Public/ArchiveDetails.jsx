import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ArchiveDetails({ event, rankings, archivedAt }) {
    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'bg-yellow-500 text-white';
            case 2: return 'bg-gray-400 text-white';
            case 3: return 'bg-orange-600 text-white';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

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
            <Head title={`${event.event_name} - Results`} />
            
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/archives" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                        &larr; Back to Archives
                    </Link>

                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.event_name}</h1>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <span>Type: {event.event_type}</span>
                            <span>Archived: {formatDate(archivedAt)}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Results</h2>
                        
                        <div className="space-y-4">
                            {rankings.map((ranking) => (
                                <div key={ranking.contestant_id} className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200">
                                    <div className={`w-12 h-12 rounded-full ${getRankColor(ranking.rank)} flex items-center justify-center text-xl font-bold`}>
                                        {ranking.rank}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{ranking.contestant_name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {ranking.rank === 1 ? '1st Place' : ranking.rank === 2 ? '2nd Place' : ranking.rank === 3 ? '3rd Place' : `${ranking.rank}th Place`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">{ranking.total_score}</div>
                                        <div className="text-sm text-gray-500">Total Score</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
