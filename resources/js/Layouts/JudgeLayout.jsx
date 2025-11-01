import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaUserGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

export default function JudgeLayout({ header, children, auth: propAuth, onContestantSelect }) {
    const pageProps = usePage().props;
    const auth = propAuth || pageProps.auth;
    const user = auth.user;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [contestants, setContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    // Fetch contestants from API
    useEffect(() => {
        const fetchContestants = async () => {
            try {
                setLoading(true);
                const response = await fetch('/fetchContestants');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch contestants');
                }
                
                const data = await response.json();
                setContestants(data);
            } catch (err) {
                console.error('Error fetching contestants:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContestants();
    }, []);

    // Function to get photo URL
    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return '/default-candidate.jpg';
        
        // If it's already a full URL, return as is
        if (photoPath.startsWith('http')) {
            return photoPath;
        }
        
        // If it's a storage path, convert to public URL
        if (photoPath.startsWith('contestants/')) {
            return `/storage/${photoPath}`;
        }
        
        // Default case
        return `/storage/${photoPath}`;
    };

    // Function to format contestant display name
    const getDisplayName = (contestant) => {
        return contestant.contestant_name || `Contestant ${contestant.id}`;
    };

    // Function to get department/cluster info
    const getContestantInfo = (contestant) => {
        return contestant.department || contestant.cluster || 'Contestant';
    };

    // Handle contestant selection
    const handleContestantSelect = (contestant) => {
        if (onContestantSelect) {
            onContestantSelect(contestant);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar - Much Wider for Bigger Display */}
            <div className="hidden md:flex md:flex-col w-[500px] bg-white border-r border-gray-200">
                {/* Logo Section - Smaller to maximize contestant space */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-gray-900" />
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">SFXC</h1>
                        <p className="text-xs text-gray-500">Tabulation System</p>
                    </div>
                </div>

                {/* Contestants Section - Maximum Space */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-lg text-red-600 mb-3">Failed to load contestants</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : contestants.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-xl text-gray-500">No contestants available</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {contestants.map((contestant) => (
                                    <div
                                        key={contestant.id}
                                        className="flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                        onClick={() => handleContestantSelect(contestant)}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={getPhotoUrl(contestant.photo)}
                                                alt={getDisplayName(contestant)}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-2xl"
                                                onError={(e) => {
                                                    e.target.src = '/default-candidate.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-2xl font-bold text-gray-900 truncate mb-2">
                                                {getDisplayName(contestant)}
                                            </p>
                                            <p className="text-xl text-gray-700 truncate mb-2">
                                                {getContestantInfo(contestant)}
                                            </p>
                                            {contestant.event && (
                                                <p className="text-lg text-gray-500 truncate">
                                                    {contestant.event.event_name}
                                                </p>
                                            )}
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

            {/* Mobile Sidebar - Also Much Bigger */}
            <div className={`fixed inset-y-0 left-0 z-50 w-[90vw] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-gray-900" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">SFXC</h1>
                            <p className="text-xs text-gray-500">Contestants</p>
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

                {/* Mobile Contestants Section - Full Height */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Contestants</h2>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-base text-red-600 mb-3">Failed to load contestants</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
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
                                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                    onClick={() => handleContestantSelect(contestant)}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={getPhotoUrl(contestant.photo)}
                                            alt={getDisplayName(contestant)}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                                            onError={(e) => {
                                                e.target.src = '/default-candidate.jpg';
                                            }}
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {contestant.sequence_no || contestant.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xl font-bold text-gray-900 truncate">
                                            {getDisplayName(contestant)}
                                        </p>
                                        <p className="text-lg text-gray-600 truncate">
                                            {getContestantInfo(contestant)}
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
                {/* Header */}
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
                        
                        {/* User Dropdown */}
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

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}