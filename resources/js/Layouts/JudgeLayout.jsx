import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { FaUserGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

export default function JudgeLayout({ header, children, auth: propAuth, onContestantSelect, selectedContestant }) {
    const { props } = usePage();
    const auth = propAuth || props.auth;
    const user = auth.user;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [tabulationData, setTabulationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentChannel, setCurrentChannel] = useState(null);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    // Fetch tabulation data from API
    const fetchTabulationData = useCallback(async () => {
        try {
            setLoading(true);
            
            const response = await fetch('/judge/tabulation-data');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setTabulationData(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch tabulation data');
            }
        } catch (err) {
            console.error('Error fetching tabulation data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const reFetchTabulationData = useCallback(async () => {
        try {
            const response = await fetch('/judge/tabulation-data');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setTabulationData(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch tabulation data');
            }
        } catch (err) {
            console.error('Error re-fetching tabulation data:', err);
        }
    }, []);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchTabulationData();
    }, [fetchTabulationData]);

    // Cleanup broadcasting on unmount
    useEffect(() => {
        return () => {
            if (window.Echo && currentChannel) {
                window.Echo.leave(currentChannel);
            }
        };
    }, [currentChannel]);

    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return '/default-candidate.jpg';
        if (photoPath.startsWith('http')) return photoPath;
        if (photoPath.startsWith('contestants/')) return `/storage/${photoPath}`;
        return `/storage/${photoPath}`;
    };

    const handleContestantSelect = useCallback((contestant) => {
        if (onContestantSelect) {
            onContestantSelect(contestant);
        }
    
        reFetchTabulationData();
    }, [onContestantSelect, reFetchTabulationData]);

    const handleRefresh = () => {
        setError(null);
        fetchTabulationData();
    };

    const contestants = tabulationData?.contestants || [];
    const currentRound = tabulationData?.active_round?.round_no;
    const eventName = tabulationData?.event?.event_name;

    return (
        <div className="min-h-screen bg-gray-50 flex">

            <div className="hidden md:flex md:flex-col w-[500px] bg-white border-r border-gray-200">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-gray-900" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">SFXC</h1>
                                <p className="text-xs text-gray-500">Tabulation System</p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh data"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                                <p className="text-gray-600">Loading contestants...</p>
                                <p className="text-sm text-gray-400 mt-2">Real-time updates enabled</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">

                                <p className="text-lg text-gray-700 mb-3 font-semibold">Waiting for Contestants</p>
                                <p className="text-sm text-gray-500 mb-4">The event is not ready yet. Please wait for the admin to set up contestants and activate the round.</p>
                                <button
                                    onClick={handleRefresh}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        ) : contestants.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <p className="text-xl text-gray-500 mb-2">No contestants available</p>
                                <p className="text-sm text-gray-400">
                                    Waiting for admin to populate this round...
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Real-time updates are enabled
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {contestants.map((contestant) => (
                                    <div
                                        key={contestant.id}
                                        className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-lg transform hover:scale-[1.02] ${
                                            selectedContestant?.id === contestant.id 
                                                ? 'border-green-500 bg-green-50 shadow-green-200' 
                                                : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                                        }`}
                                        onClick={() => handleContestantSelect(contestant)}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={getPhotoUrl(contestant.photo)}
                                                alt={contestant.contestant_name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-2xl"
                                                onError={(e) => {
                                                    e.target.src = '/default-candidate.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-2xl font-bold text-gray-900 truncate mb-2">
                                                {contestant.contestant_name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 md:hidden transition-opacity"
                    onClick={() => setMobileSidebarOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-[90vw] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-gray-900" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">SFXC</h1>
                            <p className="text-xs text-gray-500">Contestants</p>
                            {currentRound && (
                                <div className="mt-1">
                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                                        Round {currentRound}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Contestants</h2>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-base text-red-600 mb-3">Failed to load contestants</p>
                            <button 
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    ) : contestants.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-lg text-gray-500">No contestants available</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contestants.map((contestant) => (
                                <div
                                    key={contestant.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        selectedContestant?.id === contestant.id 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                    }`}
                                    onClick={() => handleContestantSelect(contestant)}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={getPhotoUrl(contestant.photo)}
                                            alt={contestant.contestant_name}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                                            onError={(e) => {
                                                e.target.src = '/default-candidate.jpg';
                                            }}
                                        />  
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xl font-bold text-gray-900 truncate">
                                            {contestant.contestant_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Score: {contestant.total_score}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 z-10">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleMobileSidebar}
                                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {header && (
                                <div>
                                    {typeof header === 'string' ? (
                                        <h1 className="text-xl font-bold text-gray-900">{header}</h1>
                                    ) : (
                                        <div className="text-xl font-bold text-gray-900">{header}</div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center p-1.5 border-transparent rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                        >
                                            <img
                                                src={user.picture ? `/storage/profile-pictures/${user.picture}` : '/default-avatar.png'}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center hover:text-blue-600">
                                        <FaUserGear className="mr-2" size={16} />
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link className="flex items-center hover:text-red-600"
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        <TbLogout className="mr-2" size={16}/>
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}