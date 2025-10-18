import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SidebarLink from '@/Components/SidebarLink';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FaFileArchive } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineEventNote } from "react-icons/md";
import { SlGraph } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";

export default function AuthenticatedLayout({ header, children, auth: propAuth }) {
    const pageProps = usePage().props;
    const auth = propAuth || pageProps.auth;
    const user = auth.user;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="hidden md:flex md:flex-col w-64 bg-white shadow-lg">
                <div className="flex items-center p-3 border-b border-gray-200">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-gray-800" />
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            {user.role_id === 1 && (
                                <>
                                    <SidebarLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.dashboard')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <SlGraph size={18} />
                                        </div>
                                        Dashboard
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.criteria')}
                                        active={route().current('admin.criteria')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <MdOutlineEventNote size={18} />
                                        </div>
                                        Criteria
                                    </SidebarLink>

                                    
                                    <SidebarLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <FaPeopleGroup size={18} />
                                        </div>
                                        Contestant
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <FaPeopleGroup size={18} />
                                        </div>
                                        Contestant Per Round
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('admin.users')}
                                        active={route().current('admin.users')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <MdAdminPanelSettings size={18} />
                                        </div>
                                        Users
                                    </SidebarLink>

                                    <SidebarLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <FaFileArchive size={18} />
                                        </div>
                                        Archive
                                    </SidebarLink>

                                    
                                    <SidebarLink
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <TbLogout size={18} />
                                        </div>
                                        Logout
                                    </SidebarLink>

                                </>
                            )}

                            {user.role_id === 2 && (
                                <>
                                <SidebarLink
                                    href={route('judge.dashboard')}
                                    active={route().current('judge.dashboard')}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                                        <SlGraph size={18} />
                                    </div>
                                    Dashboard
                                </SidebarLink>

                                <SidebarLink
                                    href={route('profile.edit')}
                                    active={route().current('profile.edit')}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                                        <FaUser size={14} />
                                    </div>
                                    Profile
                                </SidebarLink>
                                </>
                            )}
                        </div>
                    </nav>

                </div>
            </div>

            {mobileSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                ></div>
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <ApplicationLogo className="block h-10 w-auto fill-current text-gray-800" />
                    </div>
                    <button 
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            {user.role_id === 1 && (
                                <>
                                    <SidebarLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.dashboard')}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                                            <SlGraph size={18} />
                                        </div>
                                        Dashboard
                                    </SidebarLink>
                                </>
                            )}

                            {user.role_id === 2 && (
                                <SidebarLink
                                    href={route('judge.dashboard')}
                                    active={route().current('judge.dashboard')}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                                        <SlGraph size={18} />
                                    </div>
                                    Dashboard
                                </SidebarLink>
                            )}
                        </div>
                    </nav>

                    <div className="border-t border-gray-200 my-2"></div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 h-16">
                        <div className="flex items-center">
                            <button 
                                onClick={toggleMobileSidebar}
                                className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {header && (
                                <div className="ml-2">
                                    {typeof header === 'string' ? (
                                        <h1 className="text-xl font-semibold text-gray-900">{header}</h1>
                                    ) : (
                                        <div className="text-xl font-semibold text-gray-900">{header}</div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="md:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center p-2 border-transparent rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            <img
                                                src={user.picture ? `/storage/profile-pictures/${user.picture}` : '/default-avatar.png'}
                                                alt="Profile"
                                                className="w-7 h-7 rounded-full object-cover shadow-lg"
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

                <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}