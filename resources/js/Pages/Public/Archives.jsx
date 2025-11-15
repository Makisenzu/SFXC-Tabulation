import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Archives({ archivedEvents }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <PublicLayout>
            <Head title="Event Archives" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Event Archives</h1>

                    {archivedEvents.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <p className="text-gray-500">No archived events</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {archivedEvents.map(event => (
                                <Link
                                    key={event.id}
                                    href={`/archives/${event.id}`}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
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
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
