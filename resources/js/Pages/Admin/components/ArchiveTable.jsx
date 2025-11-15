import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArchive, FaEye, FaUndo, FaFileArchive } from 'react-icons/fa';
import ViewArchiveModal from './ViewArchiveModal';

export default function ArchiveTable() {
    const [archivedEvents, setArchivedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchArchivedEvents();
    }, []);

    const fetchArchivedEvents = async () => {
        try {
            const response = await axios.get('/getArchivedEvents');
            setArchivedEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching archived events:', error);
            setLoading(false);
        }
    };

    const handleViewArchive = async (event) => {
        try {
            const response = await axios.get(`/getArchivedEventDetails/${event.id}`);
            setSelectedEvent(response.data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching archive details:', error);
            alert('Failed to load archive details');
        }
    };

    const handleUnarchive = async (eventId) => {
        if (confirm('Are you sure you want to unarchive this event? It will be set as active again.')) {
            try {
                await axios.post(`/unarchiveEvent/${eventId}`);
                fetchArchivedEvents();
                alert('Event unarchived successfully!');
            } catch (error) {
                console.error('Error unarchiving event:', error);
                alert('Failed to unarchive event');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="text-center py-8">Loading archived events...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <FaFileArchive className="text-gray-600" size={24} />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Archived Events</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            View past events and their complete results
                        </p>
                    </div>
                </div>
            </div>

            {archivedEvents.length === 0 ? (
                <div className="p-12 text-center">
                    <FaArchive className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">No archived events yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Events that are archived will appear here
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Event Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contestants
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Event Period
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Archived Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {archivedEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FaArchive className="text-gray-400 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {event.event_name}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {event.event_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {event.contestants?.length || 0} contestants
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{new Date(event.event_start).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-400">
                                            to {new Date(event.event_end).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(event.updated_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewArchive(event)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                title="View Details"
                                            >
                                                <FaEye size={14} />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleUnarchive(event.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                title="Unarchive"
                                            >
                                                <FaUndo size={14} />
                                                Unarchive
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showViewModal && selectedEvent && (
                <ViewArchiveModal
                    archiveData={selectedEvent}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
}
