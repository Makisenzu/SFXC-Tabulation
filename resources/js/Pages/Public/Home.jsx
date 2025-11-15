import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Home() {
    return (
        <PublicLayout>
            <Head title="SFXC Tabulation" />

            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">SFXC Live Tabulation</h1>
                        <p className="text-xl mb-8 text-blue-100">Real-time results and event archives</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/medal-tally"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                            >
                                Medal Tally
                            </Link>
                            <Link
                                href="/archives"
                                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 border-2 border-white"
                            >
                                View Archives
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/medal-tally" className="group bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Medal Tally</h3>
                        <p className="text-gray-600">View real-time medal standings with live updates</p>
                    </Link>

                    <Link href="/archives" className="group bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Event Archives</h3>
                        <p className="text-gray-600">Browse past events and final results</p>
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
