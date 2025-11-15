import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMedal, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function MedalTable() {
    const [medals, setMedals] = useState([]);
    const [events, setEvents] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedMedal, setSelectedMedal] = useState(null);
    const [formData, setFormData] = useState({
        event_id: '',
        contestant_id: '',
        medal_type: 'Gold',
        rank: 1
    });
    const [selectedEvent, setSelectedEvent] = useState('');

    useEffect(() => {
        fetchMedals();
        fetchEvents();
    }, []);

    useEffect(() => {
        if (formData.event_id) {
            fetchContestantsByEvent(formData.event_id);
        }
    }, [formData.event_id]);

    const fetchMedals = async () => {
        try {
            const response = await axios.get('/getMedals');
            setMedals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching medals:', error);
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/getEvents');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchContestantsByEvent = async (eventId) => {
        try {
            const response = await axios.get('/getContestants');
            const filteredContestants = response.data.filter(c => c.event_id == eventId);
            setContestants(filteredContestants);
        } catch (error) {
            console.error('Error fetching contestants:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.patch(`/medals/${selectedMedal.id}`, formData);
            } else {
                await axios.post('/addMedal', formData);
            }
            fetchMedals();
            closeModal();
        } catch (error) {
            console.error('Error saving medal:', error);
        }
    };

    const handleEdit = (medal) => {
        setSelectedMedal(medal);
        setFormData({
            event_id: medal.event_id,
            contestant_id: medal.contestant_id,
            medal_type: medal.medal_type,
            rank: medal.rank
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this medal?')) {
            try {
                await axios.delete(`/deleteMedal/${id}`);
                fetchMedals();
            } catch (error) {
                console.error('Error deleting medal:', error);
            }
        }
    };

    const openModal = () => {
        setShowModal(true);
        setEditMode(false);
        setFormData({
            event_id: '',
            contestant_id: '',
            medal_type: 'Gold',
            rank: 1
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setSelectedMedal(null);
        setFormData({
            event_id: '',
            contestant_id: '',
            medal_type: 'Gold',
            rank: 1
        });
    };

    const getMedalColor = (type) => {
        switch (type) {
            case 'Gold':
                return 'text-yellow-500';
            case 'Silver':
                return 'text-gray-400';
            case 'Bronze':
                return 'text-orange-600';
            default:
                return 'text-gray-500';
        }
    };

    const filteredMedals = selectedEvent
        ? medals.filter(m => m.event_id == selectedEvent)
        : medals;

    if (loading) {
        return <div className="text-center py-8">Loading medals...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Medal Tally</h2>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus /> Add Medal
                    </button>
                </div>
                
                <div className="flex gap-4">
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Events</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.event_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contestant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Medal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMedals.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No medals found
                                </td>
                            </tr>
                        ) : (
                            filteredMedals.map((medal) => (
                                <tr key={medal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {medal.rank}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {medal.event?.event_name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {medal.contestant?.contestant_name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <FaMedal className={getMedalColor(medal.medal_type)} size={20} />
                                            <span className="text-sm font-medium">{medal.medal_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(medal)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(medal.id)}
                                                className="text-red-600 hover:text-red-900"
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {editMode ? 'Edit Medal' : 'Add New Medal'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event
                                    </label>
                                    <select
                                        name="event_id"
                                        value={formData.event_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Select Event</option>
                                        {events.map(event => (
                                            <option key={event.id} value={event.id}>
                                                {event.event_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contestant
                                    </label>
                                    <select
                                        name="contestant_id"
                                        value={formData.contestant_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Select Contestant</option>
                                        {contestants.map(contestant => (
                                            <option key={contestant.id} value={contestant.id}>
                                                {contestant.contestant_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Medal Type
                                    </label>
                                    <select
                                        name="medal_type"
                                        value={formData.medal_type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Bronze">Bronze</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rank
                                    </label>
                                    <input
                                        type="number"
                                        name="rank"
                                        value={formData.rank}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editMode ? 'Update' : 'Add'} Medal
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
