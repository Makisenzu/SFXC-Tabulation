import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMedal, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import CreateMedalTallyModal from './CreateMedalTallyModal';
import ViewMedalTallyModal from './ViewMedalTallyModal';

export default function MedalTable() {
    const [tallies, setTallies] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTally, setSelectedTally] = useState(null);

    useEffect(() => {
        fetchTallies();
    }, []);

    const fetchTallies = async (page = 1) => {
        try {
            const response = await axios.get('/getMedalTallies', {
                params: { page, per_page: pagination.per_page }
            });
            setTallies(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching medal tallies:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this medal tally?')) {
            try {
                await axios.delete(`/deleteMedalTally/${id}`);
                fetchTallies();
            } catch (error) {
                console.error('Error deleting medal tally:', error);
            }
        }
    };

    const handleView = async (tally) => {
        try {
            const response = await axios.get(`/getMedalTally/${tally.id}`);
            setSelectedTally(response.data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching tally details:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading medal tallies...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Medal Tally Management</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                        <FaPlus /> Create Medal Tally
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tally Title
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Competitions
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Participants
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tallies.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-3 sm:px-6 py-4 text-center text-gray-500 text-sm">
                                    No medal tallies found
                                </td>
                            </tr>
                        ) : (
                            tallies.map((tally) => (
                                <tr key={tally.id} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="font-semibold">{tally.tally_title}</div>
                                        <div className="md:hidden mt-1">
                                            <div className="flex flex-wrap gap-1">
                                                {tally.events?.slice(0, 2).map((event, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                        {event.event_name}
                                                    </span>
                                                ))}
                                                {tally.events?.length > 2 && (
                                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                        +{tally.events.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {tally.events?.map((event, idx) => (
                                                <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                    {event.event_name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded font-medium">
                                            {tally.participants?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(tally)}
                                                className="text-green-600 hover:text-green-900 p-2"
                                                title="View & Edit Scores"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tally.id)}
                                                className="text-red-600 hover:text-red-900 p-2"
                                                title="Delete"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            Showing {tallies.length > 0 ? ((pagination.current_page - 1) * pagination.per_page + 1) : 0} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchTallies(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="hidden sm:flex gap-1">
                                {[...Array(pagination.last_page)].map((_, idx) => {
                                    const page = idx + 1;
                                    if (
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => fetchTallies(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                    page === pagination.current_page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === pagination.current_page - 2 || page === pagination.current_page + 2) {
                                        return <span key={page} className="px-2 py-2">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            <button
                                onClick={() => fetchTallies(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <CreateMedalTallyModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        fetchTallies();
                        setShowCreateModal(false);
                    }}
                />
            )}

            {showViewModal && selectedTally && (
                <ViewMedalTallyModal
                    tally={selectedTally}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedTally(null);
                    }}
                    onUpdate={() => {
                        fetchTallies();
                    }}
                />
            )}
        </div>
    );
}
