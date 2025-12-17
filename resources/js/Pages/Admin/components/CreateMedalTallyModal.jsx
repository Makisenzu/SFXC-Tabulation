import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

export default function CreateMedalTallyModal({ onClose, onSuccess }) {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        tally_title: '',
        event_ids: [],
        participants: ['']
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/getEvents?per_page=100&show_past=true');
            const data = response.data;
            
            // Handle paginated response
            if (data.data && Array.isArray(data.data)) {
                setEvents(data.data);
            } else if (Array.isArray(data)) {
                setEvents(data);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEventToggle = (eventId) => {
        setFormData(prev => ({
            ...prev,
            event_ids: prev.event_ids.includes(eventId)
                ? prev.event_ids.filter(id => id !== eventId)
                : [...prev.event_ids, eventId]
        }));
    };

    const handleParticipantChange = (index, value) => {
        setFormData(prev => {
            const newParticipants = [...prev.participants];
            newParticipants[index] = value;
            return { ...prev, participants: newParticipants };
        });
    };

    const addParticipant = () => {
        setFormData(prev => ({
            ...prev,
            participants: [...prev.participants, '']
        }));
    };

    const removeParticipant = (index) => {
        if (formData.participants.length > 1) {
            setFormData(prev => ({
                ...prev,
                participants: prev.participants.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const filteredParticipants = formData.participants.filter(p => p.trim() !== '');
        
        if (filteredParticipants.length === 0) {
            alert('Please add at least one participant');
            return;
        }

        if (formData.event_ids.length === 0) {
            alert('Please select at least one competition');
            return;
        }

        try {
            await axios.post('/createMedalTally', {
                ...formData,
                participants: filteredParticipants
            });
            onSuccess();
        } catch (error) {
            console.error('Error creating medal tally:', error);
            alert('Failed to create medal tally');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8 mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Create Medal Tally</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Tally Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tally Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="tally_title"
                                value={formData.tally_title}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., SFXC 2024 Medal Tally"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Competitions Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Competitions <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                                {events.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No events available</p>
                                ) : (
                                    events.map(event => (
                                        <label key={event.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.event_ids.includes(event.id)}
                                                onChange={() => handleEventToggle(event.id)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm">{event.event_name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                            {formData.event_ids.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {formData.event_ids.length} competition(s) selected
                                </p>
                            )}
                        </div>

                        {/* Participants */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Participants <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {formData.participants.map((participant, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={participant}
                                            onChange={(e) => handleParticipantChange(index, e.target.value)}
                                            placeholder={`Participant ${index + 1}`}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                        {formData.participants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeParticipant(index)}
                                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addParticipant}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    <FaPlus size={12} /> Add Participant
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Create Medal Tally
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
