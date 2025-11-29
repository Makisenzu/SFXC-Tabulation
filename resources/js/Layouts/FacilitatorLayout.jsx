import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaBars, FaTimes, FaTrophy, FaSignOutAlt } from 'react-icons/fa';

export default function FacilitatorLayout({ children, header }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
                    <h2 className="text-xl font-bold text-white">Facilitator Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info */}
                <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-gray-400">Facilitator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-2">
                    <Link
                        href={route('facilitator.dashboard')}
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-150"
                    >
                        <FaTrophy className="w-5 h-5 mr-3" />
                        <span className="font-medium">Medal Tally</span>
                    </Link>
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-150"
                    >
                        <FaSignOutAlt className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Navigation */}
                <div className="sticky top-0 z-10 flex items-center h-16 bg-white border-b border-gray-200 px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-600 mr-4"
                    >
                        <FaBars className="w-6 h-6" />
                    </button>
                    {header && (
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-gray-900">{header}</h1>
                        </div>
                    )}
                </div>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
