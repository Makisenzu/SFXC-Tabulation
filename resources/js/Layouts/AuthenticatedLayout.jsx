import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SidebarLink from '@/Components/SidebarLink';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaFileArchive } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineEventNote } from "react-icons/md";
import { SlGraph } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaMedal } from "react-icons/fa6";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default function AuthenticatedLayout({ header, children, auth: propAuth }) {
    const pageProps = usePage().props;
    const auth = propAuth || pageProps.auth;
    const user = auth.user;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [helpNotifications, setHelpNotifications] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    useEffect(() => {
        // Only listen for admin notifications if user is an admin
        if (user.role_id !== 1) {
            return;
        }

        // Initialize Pusher
        window.Pusher = Pusher;
        
        const echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            enabledTransports: ['ws', 'wss']
        });

        // Listen for judge help requests
        const channel = echo.channel('admin-notifications');
        
        channel.listen('.judge.help.requested', (data) => {
            const notification = {
                id: Date.now(),
                judgeName: data.judgeName,
                judgeId: data.judgeId,
                eventName: data.eventName,
                roundNumber: data.roundNumber,
                timestamp: data.timestamp
            };

            setHelpNotifications(prev => [notification, ...prev]);
            setShowNotification(true);

            // Auto-hide notification after 10 seconds
            setTimeout(() => {
                setShowNotification(false);
            }, 10000);

            // Play notification sound (optional)
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => {});
        });

        return () => {
            echo.leaveChannel('admin-notifications');
            echo.disconnect();
        };
    }, [user.role_id]);

    const dismissNotification = (id) => {
        setHelpNotifications(prev => prev.filter(n => n.id !== id));
        if (helpNotifications.length <= 1) {
            setShowNotification(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-col w-72 bg-white border-r border-gray-200">
                {/* Logo Section */}
                <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-gray-900" />
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">SFXC</h1>
                        <p className="text-xs text-gray-500">Tabulation System</p>
                    </div>
                </div>

                {/* User Info Card */}
                    {/* <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <img
                                src={user.picture ? `/storage/profile-pictures/${user.picture}` : '/default-avatar.png'}
                                alt="Profile"
                                className="w-11 h-11 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user.role_id === 1 ? 'Administrator' : 'Judge'}
                                </p>
                            </div>
                        </div>
                    </div> */}

                {/* Navigation */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-4 py-6">
                        <div className="space-y-1">
                            {user.role_id === 1 && (
                                <>
                                    <div className="px-3 mb-3">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Main Menu
                                        </p>
                                    </div>

                                    <SidebarLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.dashboard')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <SlGraph size={18} />
                                        </div>
                                        Dashboard
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.criteria')}
                                        active={route().current('admin.criteria')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <MdOutlineEventNote size={18} />
                                        </div>
                                        Events
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.contestant')}
                                        active={route().current('admin.contestant')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaPeopleGroup size={18} />
                                        </div>
                                        Contestants
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.CPR')}
                                        active={route().current('admin.CPR')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaPeopleGroup size={18} />
                                        </div>
                                        Contestant Per Round
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.medal')}
                                        active={route().current('admin.medal')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaMedal size={18} />
                                        </div>
                                        Medal Tally
                                    </SidebarLink>

                                    <div className="px-3 mt-6 mb-3">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Management
                                        </p>
                                    </div>

                                    <SidebarLink
                                        href={route('admin.users')}
                                        active={route().current('admin.users')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <MdAdminPanelSettings size={18} />
                                        </div>
                                        Users
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.archive')}
                                        active={route().current('admin.archive')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaFileArchive size={18} />
                                        </div>
                                        Archives
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.sync')}
                                        active={route().current('admin.sync')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </div>
                                        Sync to Online
                                    </SidebarLink>
                                </>
                            )}

                            {user.role_id === 2 && (
                                <>
                                    <SidebarLink
                                        href={route('judge.dashboard')}
                                        active={route().current('judge.dashboard')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <SlGraph size={18} />
                                        </div>
                                        Dashboard
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaUser size={14} />
                                        </div>
                                        Profile
                                    </SidebarLink>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200">
                        <SidebarLink
                            href={route('logout')}
                            method="post"
                            as="button"
                        >
                            <div className="w-5 h-5 flex items-center justify-center mr-3">
                                <TbLogout size={18} />
                            </div>
                            Logout
                        </SidebarLink>
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
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Mobile Logo & Close */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-900" />
                        <div>
                            <h1 className="text-base font-bold text-gray-900">SFXC</h1>
                            <p className="text-xs text-gray-500">Tabulation</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Mobile User Info */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <img
                            src={user.picture ? `/storage/profile-pictures/${user.picture}` : '/default-avatar.png'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user.role_id === 1 ? 'Administrator' : 'Judge'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-4 py-6">
                        <div className="space-y-1">
                            {user.role_id === 1 && (
                                <>
                                    <SidebarLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.dashboard')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <SlGraph size={18} />
                                        </div>
                                        Dashboard
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.criteria')}
                                        active={route().current('admin.criteria')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <MdOutlineEventNote size={18} />
                                        </div>
                                        Events
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.contestant')}
                                        active={route().current('admin.contestant')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaPeopleGroup size={18} />
                                        </div>
                                        Contestants
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.CPR')}
                                        active={route().current('admin.CPR')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaPeopleGroup size={18} />
                                        </div>
                                        Contestant Per Round
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.users')}
                                        active={route().current('admin.users')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <MdAdminPanelSettings size={18} />
                                        </div>
                                        Users
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.archive')}
                                        active={route().current('admin.archive')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaFileArchive size={18} />
                                        </div>
                                        Archives
                                    </SidebarLink>
                                </>
                            )}

                            {user.role_id === 2 && (
                                <>
                                    <SidebarLink
                                        href={route('judge.dashboard')}
                                        active={route().current('judge.dashboard')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <SlGraph size={18} />
                                        </div>
                                        Dashboard
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                                            <FaUser size={14} />
                                        </div>
                                        Profile
                                    </SidebarLink>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <SidebarLink
                            href={route('logout')}
                            method="post"
                            as="button"
                        >
                            <div className="w-5 h-5 flex items-center justify-center mr-3">
                                <TbLogout size={18} />
                            </div>
                            Logout
                        </SidebarLink>
                    </div>
                </div>
            </div>

            {/* Help Notification Popup */}
            {showNotification && helpNotifications.length > 0 && (
                <div className="fixed top-20 right-4 z-50 space-y-2">
                    {helpNotifications.slice(0, 3).map((notification) => {
                        // Format judge name from "judge1" to "Judge 1"
                        const formattedJudgeName = notification.judgeName
                            .replace(/judge(\d+)/i, 'Judge $1');
                        
                        return (
                            <div
                                key={notification.id}
                                className="bg-red-600 text-white p-4 rounded-lg shadow-2xl animate-bounce w-80"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <h3 className="font-bold text-lg">Help Request!</h3>
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-lg">{formattedJudgeName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => dismissNotification(notification.id)}
                                        className="ml-4 text-white hover:text-gray-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-md z-10">
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
                        
                        {/* Mobile User Dropdown */}
                        <div className="md:hidden">
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
