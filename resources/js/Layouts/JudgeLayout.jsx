import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { FaUserGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

export default function JudgeLayout({ header, children, auth: propAuth, onContestantSelect, selectedContestant }) {
    console.log('🎯 JudgeLayout rendering');
    
    const { props } = usePage();
    const auth = propAuth || props.auth;
    const user = auth.user;
    
    console.log('👤 User ID:', user?.id);
    console.log('🌍 Window.Echo exists:', !!window.Echo);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [tabulationData, setTabulationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    // Fetch tabulation data from API
    const fetchTabulationData = useCallback(async (roundNo = null) => {
        try {
            setLoading(true);
            
            const url = roundNo ? `/judge/tabulation-data?round_no=${roundNo}` : '/judge/tabulation-data';
            const response = await fetch(url);
            
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

    // Initial data fetch on component mount
    useEffect(() => {
        fetchTabulationData();
    }, []); // Empty dependency - only run once on mount

    // Cleanup broadcasting on unmount
    useEffect(() => {
        return () => {
            if (window.Echo && currentChannel) {
                window.Echo.leave(currentChannel);
            }
        };
    }, [currentChannel]);

    // Listen for judge notifications from admin - EXACTLY like admin listens for help requests
    useEffect(() => {
        if (!user?.id) return;

        console.log('🔧 Setting up judge notification listener for user:', user.id);

        // Listen on the specific judge's channel
        const channelName = `judge-notifications.${user.id}`;
        
        // Use the global Echo instance that's already initialized
        if (!window.Echo) {
            console.error('❌ window.Echo not available');
            return;
        }

        console.log('📡 Subscribing to private channel:', channelName);
        const channel = window.Echo.private(channelName);
        
        // Log all Pusher events for debugging
        if (window.Echo.connector && window.Echo.connector.pusher) {
            const pusher = window.Echo.connector.pusher;
            console.log('🔌 Pusher connection state:', pusher.connection.state);
            
            pusher.connection.bind('connected', () => {
                console.log('✅ Pusher connected');
            });
            
            pusher.connection.bind('error', (err) => {
                console.error('❌ Pusher connection error:', err);
            });
        }
        
        channel.listen('.judge.notification', (data) => {
            console.log('🔔 NOTIFICATION RECEIVED!', data);
            
            setNotification(data.notification);
            setShowNotificationModal(true);

            // Auto-hide after 30 seconds (optional)
            setTimeout(() => {
                setShowNotificationModal(false);
            }, 30000);
        });

        console.log('✅ Judge notification listener set up on:', channelName);

        return () => {
            console.log('🧹 Cleanup: leaving channel:', channelName);
            window.Echo.leave(channelName);
        };
    }, [user?.id]);

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
    }, [onContestantSelect]);

    const handleRefresh = () => {
        setError(null);
        fetchTabulationData();
    };

    const contestants = tabulationData?.contestants || [];
    const currentRound = tabulationData?.active_round?.round_no;
    const viewingRound = tabulationData?.viewing_round?.round_no || currentRound;
    const availableRounds = tabulationData?.available_rounds || [];
    const isLocked = tabulationData?.is_locked || false;
    const eventName = tabulationData?.event?.event_name;

    const handleRoundChange = (roundNo) => {
        fetchTabulationData(roundNo);
        if (onContestantSelect) {
            onContestantSelect(null); // Clear selection when changing rounds
        }
    };

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

                {/* Round Navigation */}
                {availableRounds.length > 0 && (
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            SELECT ROUND
                        </label>
                        <div className="flex items-center gap-2">
                            <select
                                value={viewingRound}
                                onChange={(e) => handleRoundChange(Number(e.target.value))}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium"
                            >
                                {availableRounds.map((round) => (
                                    <option key={round.id} value={round.round_no}>
                                        Round {round.round_no} {round.is_active ? '(Active)' : ''}
                                    </option>
                                ))}
                            </select>
                            {isLocked && (
                                <div className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-xs font-semibold">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>
                        {isLocked && (
                            <p className="text-xs text-red-600 mt-2">
                                This round is from a previous round. Scores cannot be modified.
                            </p>
                        )}
                    </div>
                )}
                
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
                <header className="bg-gradient-to-r from-slate-700 to-slate-800 shadow-md z-10">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleMobileSidebar}
                                className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {header && (
                                <div>
                                    {typeof header === 'string' ? (
                                        <h1 className="text-xl font-bold text-white">{header}</h1>
                                    ) : (
                                        <div className="text-xl font-bold text-white">{header}</div>
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
                                            className="inline-flex items-center p-1.5 border-transparent rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                                        >
                                            <img
                                                src={user.picture ? `/storage/profile-pictures/${user.picture}` : '/default-avatar.png'}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                            />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
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

                <main className="flex-1 overflow-hidden bg-gray-50">
                    {children}
                </main>
            </div>

            {/* Notification Modal */}
            {showNotificationModal && notification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-bounce-in">
                        <div className="bg-red-500 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
                            <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            <h3 className="text-xl font-bold">Admin Notification</h3>
                        </div>
                        <div className="p-6">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <p className="text-gray-800 font-medium text-lg">
                                    {notification.message}
                                </p>
                            </div>
                            <div className="text-xs text-gray-500 mb-4">
                                {notification.timestamp}
                            </div>
                            <button
                                onClick={() => {
                                    setShowNotificationModal(false);
                                    setNotification(null);
                                }}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}