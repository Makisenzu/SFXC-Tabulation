import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import appLogo from '@/images/bgimage.jpg';
import cbeStory from '@/images/CBE Story.jpg';
import cbeML from '@/images/CBE ML.jpg';
import ccjeStory from '@/images/CCJE Story.jpg';
import ccjeML from '@/images/CCJE ML.jpg';
import cteStory from '@/images/CTE Story.jpg';
import cteML from '@/images/CTE ML.jpg';

export default function Home() {
    return (
        <PublicLayout>
            <Head title="SFXC Tabulation" />

            {/* Hero Section */}
            <div className="relative text-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={appLogo}
                        alt="App Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Semi-transparent dark overlay */}
                <div className="absolute inset-0 bg-black/50"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
                            SFXC Tabulation
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-blue-100 font-medium max-w-3xl mx-auto leading-relaxed">
                            Results and comprehensive event archives for all St Francis Xavier College competitions
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/medal-tally"
                                className="w-full sm:w-auto bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                View Medal Tally
                            </Link>
                            <Link
                                href="/archives"
                                className="w-full sm:w-auto bg-white text-blue-900 px-8 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Browse Archives
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* Movie Poster Section */}
            <div className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Xavier Knights Story
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            {/* Three powerful platforms, one unified system */}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Poster 1 - CBE Story */}
                        <Link href="/medal-tally" className="group relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 aspect-[2/3]">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={cbeStory}
                                    alt="CBE Story"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors"></div>
                            
                            <div className="relative h-full flex flex-col justify-between p-8">
                                <div>
                                    <div className="inline-block px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider shadow-lg">
                                        College of Business Education
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-4xl font-black text-white mb-3 leading-tight drop-shadow-lg">
                                        Eroplanong<br />Papel
                                    </h3>
                                    <p className="text-white text-sm font-medium mb-6 leading-relaxed drop-shadow-md">
                                       A story about believing in someone who can't believe in themselves
                                    </p>
                                </div>
                            </div>
                        </Link>

                                                {/* Poster 3 - CTE Story */}
                                                <div className="group relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 aspect-[2/3]">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={cteStory}
                                    alt="CTE Story"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors"></div>
                            
                            <div className="relative h-full flex flex-col justify-between p-8">
                                <div>
                                    <div className="inline-block px-4 py-1 bg-blue-400 text-blue-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider shadow-lg">
                                        COLLEGE OF TEACHER EDUCATION
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-4xl font-black text-white mb-3 leading-tight drop-shadow-lg">
                                        FUTURCONY
                                    </h3>
                                    <p className="text-white text-sm font-medium mb-6 leading-relaxed drop-shadow-md">
                                        Her story reminds us: learning doesn't pause when life begins.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Poster 2 - CCJE Story */}
                        <Link href="/archives" className="group relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 aspect-[2/3]">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={ccjeStory}
                                    alt="CCJE Story"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors"></div>
                            
                            <div className="relative h-full flex flex-col justify-between p-8">
                                <div>
                                    <div className="inline-block px-4 py-1 bg-red-400 text-red-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wider shadow-lg">
                                        COLLEGE OF CRIMINAL JUSTICE EDUCATION
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-4xl font-black text-white mb-3 leading-tight drop-shadow-lg">
                                        TRACES<br />OF TRIUMPH
                                    </h3>
                                    <p className="text-white text-sm font-medium mb-6 leading-relaxed drop-shadow-md">
                                        GUIDED BY LOVE, FUELED BY COURAGE, DESTINED FOR TRIUMPH
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/*MLBB SECTION*/}
            <div className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Mobile Legends Bang Bang
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            {/* Three powerful platforms, one unified system */}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Poster 1 - CBE ML */}
                        <div className="relative aspect-[2/3] p-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-2xl shadow-yellow-500/50">
                            <Link href="/medal-tally" className="group relative w-full h-full rounded-xl overflow-hidden block">
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={cbeML}
                                        alt="CBE ML"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors"></div>
                                
                                {/* Team Name - Bottom Center */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-2xl">
                                        CBE
                                    </h3>
                                </div>
                            </Link>
                        </div>

                        {/* Poster 3 - CTE ML */}
                        <div className="relative aspect-[2/3] p-1 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 shadow-2xl shadow-blue-500/50">
                            <div className="group relative w-full h-full rounded-xl overflow-hidden">
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={cteML}
                                        alt="CTE ML"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors"></div>
                                
                                {/* Team Name - Bottom Center */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-2xl">
                                        CTE
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Poster 2 - CCJE ML */}
                        <div className="relative aspect-[2/3] p-1 rounded-2xl bg-gradient-to-r from-red-500 via-rose-600 to-red-500 shadow-2xl shadow-red-500/50">
                            <Link href="/archives" className="group relative w-full h-full rounded-xl overflow-hidden block">
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={ccjeML}
                                        alt="CCJE ML"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors"></div>
                                
                                {/* Team Name - Bottom Center */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-2xl">
                                        CCJE
                                    </h3>
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-white">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What We Offer
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Access competition results and medal standings in real-time
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    <Link 
                        href="/medal-tally" 
                        className="group bg-white rounded-lg border-2 border-gray-200 p-8 hover:border-blue-600 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                            Medal Tally
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                            View real-time medal standings with live updates as competitions progress. Track performance across all events.
                        </p>
                        <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                            <span>View Standings</span>
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    <Link 
                        href="/archives" 
                        className="group bg-white rounded-lg border-2 border-gray-200 p-8 hover:border-green-600 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                            Event Archives
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                            Browse past events and review final results from previous competitions. Access complete historical data.
                        </p>
                        <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
                            <span>Browse Events</span>
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-gray-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center max-w-3xl mx-auto">
                        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md">
                            <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">24/7</div>
                            <div className="text-sm sm:text-base font-semibold text-gray-700">Access Anytime</div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Available whenever you need it</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md">
                            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">100%</div>
                            <div className="text-sm sm:text-base font-semibold text-gray-700">Accurate Results</div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Verified and reliable data</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}