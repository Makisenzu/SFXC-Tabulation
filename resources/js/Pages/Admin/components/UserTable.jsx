import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaUser, FaUserTie, FaUserShield, FaGavel } from 'react-icons/fa';
import Pagination from '@/Components/Pagination';

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/getUsers');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API Response:', data);
                
                if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else if (data && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    console.warn('Unexpected API response format:', data);
                    setUsers([]);
                }
                
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error.message);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Safe user data access with fallbacks
    const safeUsers = Array.isArray(users) ? users : [];

    // Calculate pagination
    const totalPages = Math.ceil(safeUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = safeUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Function to format username for display
    const formatUsername = (username) => {
        if (!username) return 'No username';
        
        // Convert to lowercase first for consistent processing
        const lowerUsername = username.toLowerCase();
        
        // Handle specific patterns
        if (lowerUsername === 'admin') {
            return 'Admin';
        } else if (lowerUsername.startsWith('judge')) {
            // Extract number from "judge1", "judge2", etc.
            const number = lowerUsername.replace('judge', '');
            return `Judge ${number ? number : ''}`.trim();
        } else {
            // Capitalize first letter of each word for other usernames
            return username
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
    };

    // Function to get role-based icon
    const getRoleIcon = (roleName) => {
        const roleConfig = {
            'Admin': {
                icon: FaUserShield,
                color: 'text-red-600'
            },
            'Judge': {
                icon: FaUserTie,
                color: 'text-blue-600'
            }
        };

        const config = roleConfig[roleName] || {
            icon: FaUser,
            color: 'text-gray-600'
        };

        const IconComponent = config.icon;

        return <IconComponent className={`w-5 h-5 ${config.color}`} />;
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            console.log('Delete user:', userId);
            // Add your delete logic here
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            'Admin': { color: 'bg-red-100 text-red-800', icon: FaUserTie },
            'Judge': { color: 'bg-blue-100 text-blue-800', icon: FaUser }
        };

        const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', icon: FaUser };
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {role}
            </span>
        );
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FaEye className="w-3 h-3 mr-1" />
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <FaEyeSlash className="w-3 h-3 mr-1" />
                Inactive
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-6 text-center">
                    <div className="text-red-600 mb-4">
                        <FaUser className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <h3 className="text-lg font-semibold">Error Loading Users</h3>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
                    </div>
                    <Link
                        href={route('admin.users')}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                    >
                        Add User
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <FaUser className="w-10 h-10 text-gray-300 mb-2" />
                                        <p>No users found</p>
                                        <p className="text-xs mt-1">Get started by creating a new user</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                {getRoleIcon(user.role?.role_name)}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatUsername(user.username)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getRoleBadge(user.role?.role_name || 'Unknown')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(user.is_active)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Link
                                                href={route('admin.users', user.id)}
                                                className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                            >
                                                <FaEdit className="w-3 h-3 mr-1" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="inline-flex items-center px-2 py-1 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors duration-150"
                                            >
                                                <FaTrash className="w-3 h-3 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Pagination */}
            {safeUsers.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(indexOfLastItem, safeUsers.length)}
                            </span> of{' '}
                            <span className="font-medium">{safeUsers.length}</span> users
                        </div>
                        
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}