import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMedal, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import CreateMedalTallyModal from './CreateMedalTallyModal';
import ViewMedalTallyModal from './ViewMedalTallyModal';

export default function MedalTable() {
    const [tallies, setTallies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTally, setSelectedTally] = useState(null);

    useEffect(() => {
        fetchTallies();
    }, []);

    const fetchTallies = async () => {
        try {
            const response = await axios.get('/getMedalTallies');
            setTallies(response.data);
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
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Medal Tally Management</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus /> Create Medal Tally
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tally Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Competitions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Participants
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tallies.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No medal tallies found
                                </td>
                            </tr>
                        ) : (
                            tallies.map((tally) => (
                                <tr key={tally.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {tally.tally_title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex flex-wrap gap-1">
                                            {tally.events?.map((event, idx) => (
                                                <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                    {event.event_name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {tally.participants?.length || 0} participants
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(tally)}
                                                className="text-green-600 hover:text-green-900"
                                                title="View & Edit Scores"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tally.id)}
                                                className="text-red-600 hover:text-red-900"
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
