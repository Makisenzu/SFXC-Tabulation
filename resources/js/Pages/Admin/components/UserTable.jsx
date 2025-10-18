import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaUser, FaUserTie, FaUserShield, FaGavel, FaPlus } from 'react-icons/fa';
import Pagination from '@/Components/Pagination';
import FormModal from '@/Components/FormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { showAlert, confirmDialog } from '@/Sweetalert';

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    
    const [editingUser, setEditingUser] = useState(null);
    
    const [addUserFormData, setAddUserFormData] = useState({});
    const [editUserFormData, setEditUserFormData] = useState({});

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

    const safeUsers = Array.isArray(users) ? users : [];

    const totalPages = Math.ceil(safeUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = safeUsers.slice(indexOfFirstItem, indexOfLastItem);

    const generateUsername = (roleId) => {
        if (roleId === '1') {
            const adminExists = safeUsers.some(user => 
                user.username?.toLowerCase() === 'admin'
            );
            
            if (!adminExists) {
                return 'admin';
            } else {
                const adminUsers = safeUsers.filter(user => 
                    user.role_id === 1 || user.role?.role_name === 'Admin'
                );
                
                const adminNumbers = adminUsers.map(user => {
                    if (user.username?.toLowerCase() === 'admin') return 0;
                    const match = user.username?.match(/admin(\d+)/i);
                    return match ? parseInt(match[1]) : 0;
                }).filter(num => num >= 0);
                
                const highestNumber = adminNumbers.length > 0 ? Math.max(...adminNumbers) : 0;
                
                return highestNumber === 0 ? 'admin1' : `admin${highestNumber + 1}`;
            }
        } 
        else if (roleId === '2') {
            const judgeUsers = safeUsers.filter(user => 
                user.role_id === 2 || user.role?.role_name === 'Judge'
            );
            
            const judgeNumbers = judgeUsers.map(user => {
                const match = user.username?.match(/judge(\d+)/i);
                return match ? parseInt(match[1]) : 0;
            }).filter(num => num > 0);

            const highestNumber = judgeNumbers.length > 0 ? Math.max(...judgeNumbers) : 0;
            
            return `judge${highestNumber + 1}`;
        }
        
        return '';
    };

    const addUserFields = useMemo(() => ([
        {
            name: 'role_id',
            label: 'Role',
            type: 'select',
            options: [
                { value: '1', label: 'Admin' },
                { value: '2', label: 'Judge' }
            ],
            required: true
        },
        {
            name: 'is_active',
            label: 'Status',
            type: 'select',
            options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ],
            required: true
        }
    ]), []);

    const editUserFields = useMemo(() => ([
        {
            name: 'is_active',
            label: 'Status',
            type: 'select',
            options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ],
            required: true
        }
    ]), []);

    const openAddUser = () => {
        setAddUserFormData({
            role_id: '',
            is_active: '1'
        });
        setShowAddUserModal(true);
    };

    const closeAddUser = () => {
        setShowAddUserModal(false);
        setAddUserFormData({});
    };

    const openEditUser = (user) => {
        setEditingUser(user);
        setEditUserFormData({
            is_active: user.is_active?.toString() || '1'
        });
        setShowEditUserModal(true);
    };

    const closeEditUser = () => {
        setShowEditUserModal(false);
        setEditingUser(null);
        setEditUserFormData({});
    };

    const handleAddFormChange = (formData) => {
        setAddUserFormData(formData);
    };

    const handleEditFormChange = (formData) => {
        setEditUserFormData(formData);
    };

    const refetchUsers = async () => {
        try {
            const response = await fetch('/getUsers');
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else if (data && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else if (data && Array.isArray(data.data)) {
                    setUsers(data.data);
                }
            }
        } catch (error) {
            console.error('Error refetching users:', error);
        }
    };

    const handleAddUserSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            const username = generateUsername(formData.role_id);
            const userData = {
                ...formData,
                username: username,
                password: '12345678'
            };
            
            console.log('Adding user with data:', userData);
            
            router.post('/admin/users', userData, {
                onSuccess: () => {
                    showAlert('success', `User added successfully! Username: ${username}`);
                    refetchUsers();
                    resolve();
                },
                onError: (errors) => {
                    console.error(errors);
                    showAlert('error', 'Failed to add user');
                    reject(errors);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        });

    const handleEditUserSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            const userData = {
                is_active: formData.is_active
            };
            
            console.log('Updating user status:', userData);
            
            router.put(`/admin/users/${editingUser.id}`, userData, {
                onSuccess: () => {
                    showAlert('success', 'User status updated successfully');
                    refetchUsers();
                    resolve();
                },
                onError: (errors) => {
                    showAlert('error', 'Failed to update user status');
                    reject(errors);
                },
                onFinish: () => setProcessing(false)
            });
        });

    const handleDelete = async (userId) => {
        const confirmed = await confirmDialog(
            'Are you sure?',
            'This will delete the user permanently!',
            'Yes, delete it'
        );
        if (!confirmed) return;

        router.delete(`/admin/users/${userId}`, {
            onSuccess: () => {
                showAlert('success', 'User deleted successfully');
                refetchUsers();
            },
            onError: () => showAlert('error', 'Failed to delete user'),
        });
    };

    const formatUsername = (username) => {
        if (!username) return 'No username';
        
        const lowerUsername = username.toLowerCase();
        
        if (lowerUsername === 'admin') {
            return 'Admin';
        } else if (lowerUsername.startsWith('admin')) {
            const number = lowerUsername.replace('admin', '');
            return `Admin ${number ? number : ''}`.trim();
        } else if (lowerUsername.startsWith('judge')) {
            const number = lowerUsername.replace('judge', '');
            return `Judge ${number ? number : ''}`.trim();
        } else {
            return username
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
    };

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            'Admin': { color: 'bg-red-100 text-red-800' },
            'Judge': { color: 'bg-blue-100 text-blue-800' }
        };

        const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800' };

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
        <>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">

                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
                        </div>
                        <PrimaryButton onClick={openAddUser}>
                            <FaPlus className="mr-2" /> Add User
                        </PrimaryButton>
                    </div>
                </div>

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
                                                <button
                                                    onClick={() => openEditUser(user)}
                                                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                >
                                                    <FaEdit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </button>
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

            <FormModal
                show={showAddUserModal}
                onClose={closeAddUser}
                title="Add User"
                fields={addUserFields}
                onSubmit={handleAddUserSubmit}
                submitText={processing ? 'Adding...' : 'Add User'}
                processing={processing}
                formData={addUserFormData}
                onFormChange={handleAddFormChange}
                key={`add-user-${showAddUserModal}`}
            />

            <FormModal
                show={showEditUserModal}
                onClose={closeEditUser}
                title={`Editing - ${editingUser ? formatUsername(editingUser.username) : ''}`}
                initialData={editingUser}
                fields={editUserFields}
                onSubmit={handleEditUserSubmit}
                submitText={processing ? 'Saving...' : 'Save Changes'}
                processing={processing}
                formData={editUserFormData}
                onFormChange={handleEditFormChange}
                key={`edit-user-${editingUser?.id || 'none'}`}
            />
        </>
    );
}