import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
    FaEdit, 
    FaTrash, 
    FaPlus, 
    FaCalendarAlt, 
    FaUser,
    FaChevronDown,
    FaChevronRight
} from 'react-icons/fa';
import FormModal from '@/Components/FormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { showAlert, confirmDialog } from '@/Sweetalert';

export default function ContestantTable() {
    const [events, setEvents] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [showAddContestantModal, setShowAddContestantModal] = useState(false);
    const [showEditContestantModal, setShowEditContestantModal] = useState(false);
    
    const [processing, setProcessing] = useState(false);
    
    const [editingContestant, setEditingContestant] = useState(null);
    
    const [addContestantFormData, setAddContestantFormData] = useState({});
    const [editContestantFormData, setEditContestantFormData] = useState({});

    // State for expanded events
    const [expandedEvents, setExpandedEvents] = useState(new Set());

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch events
                const eventsResponse = await fetch('/getEvents');
                if (!eventsResponse.ok) {
                    throw new Error(`HTTP error! status: ${eventsResponse.status}`);
                }
                const eventsData = await eventsResponse.json();
                
                // Fetch contestants
                const contestantsResponse = await fetch('/getContestants');
                if (!contestantsResponse.ok) {
                    throw new Error(`HTTP error! status: ${contestantsResponse.status}`);
                }
                const contestantsData = await contestantsResponse.json();

                // Process events data
                let processedEvents = [];
                if (Array.isArray(eventsData)) {
                    processedEvents = eventsData;
                } else if (eventsData && Array.isArray(eventsData.events)) {
                    processedEvents = eventsData.events;
                } else if (eventsData && Array.isArray(eventsData.data)) {
                    processedEvents = eventsData.data;
                }
                setEvents(processedEvents);

                // Process contestants data
                let processedContestants = [];
                if (Array.isArray(contestantsData)) {
                    processedContestants = contestantsData;
                } else if (contestantsData && Array.isArray(contestantsData.contestants)) {
                    processedContestants = contestantsData.contestants;
                } else if (contestantsData && Array.isArray(contestantsData.data)) {
                    processedContestants = contestantsData.data;
                }
                setContestants(processedContestants);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setEvents([]);
                setContestants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const safeEvents = Array.isArray(events) ? events : [];
    const safeContestants = Array.isArray(contestants) ? contestants : [];

    // Group contestants by event
    const contestantsByEvent = useMemo(() => {
        const grouped = {};
        safeContestants.forEach(contestant => {
            const eventId = contestant.event_id;
            if (!grouped[eventId]) {
                grouped[eventId] = [];
            }
            grouped[eventId].push(contestant);
        });
        return grouped;
    }, [safeContestants]);

    // Get events that have contestants
    const eventsWithContestants = useMemo(() => {
        return safeEvents.filter(event => contestantsByEvent[event.id]?.length > 0);
    }, [safeEvents, contestantsByEvent]);

    // Toggle event expansion
    const toggleEventExpansion = (eventId) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    // Expand all events
    const expandAllEvents = () => {
        const allEventIds = new Set(eventsWithContestants.map(event => event.id));
        setExpandedEvents(allEventIds);
    };

    // Collapse all events
    const collapseAllEvents = () => {
        setExpandedEvents(new Set());
    };

    // Contestant form fields
    const addContestantFields = useMemo(() => ([
        {
            name: 'event_id',
            label: 'Event',
            type: 'select',
            options: safeEvents
                .filter(event => event.is_active)
                .map(event => ({
                    value: event.id,
                    label: `${event.event_name} - ${event.event_type}`
                })),
            required: true
        },
        {
            name: 'contestant_name',
            label: 'Contestant Name',
            type: 'text',
            required: true,
            placeholder: 'Enter contestant name'
        },
        {
            name: 'sequence_no',
            label: 'Sequence No',
            type: 'number',
            required: true,
            placeholder: 'Contestant sequence number'
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
    ]), [safeEvents]);

    const editContestantFields = useMemo(() => ([
        {
            name: 'event_id',
            label: 'Event',
            type: 'select',
            options: safeEvents
                .filter(event => event.is_active)
                .map(event => ({
                    value: event.id,
                    label: `${event.event_name} - ${event.event_type}`
                })),
            required: true
        },
        {
            name: 'contestant_name',
            label: 'Contestant Name',
            type: 'text',
            required: true,
            placeholder: 'Enter contestant name'
        },
        {
            name: 'photo',
            label: 'Photo',
            type: 'file',
            required: false,
            placeholder: 'Upload contestant photo'
        },
        {
            name: 'round_no',
            label: 'Round Number',
            type: 'number',
            required: true,
            min: 1,
            placeholder: 'Enter round number'
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
    ]), [safeEvents]);

    // Modal handlers for Contestants
    const openAddContestant = () => {
        setAddContestantFormData({
            event_id: '',
            contestant_name: '',
            photo: '',
            round_no: '1',
            is_active: '1'
        });
        setShowAddContestantModal(true);
    };

    const closeAddContestant = () => {
        setShowAddContestantModal(false);
        setAddContestantFormData({});
    };

    const openEditContestant = (contestant) => {
        setEditingContestant(contestant);
        setEditContestantFormData({
            event_id: contestant.event_id?.toString() || '',
            contestant_name: contestant.contestant_name || '',
            photo: contestant.photo || '',
            round_no: contestant.round_no?.toString() || '1',
            is_active: contestant.is_active?.toString() || '1'
        });
        setShowEditContestantModal(true);
    };

    const closeEditContestant = () => {
        setShowEditContestantModal(false);
        setEditingContestant(null);
        setEditContestantFormData({});
    };

    // Form change handlers
    const handleAddContestantFormChange = (formData) => {
        setAddContestantFormData(formData);
    };

    const handleEditContestantFormChange = (formData) => {
        setEditContestantFormData(formData);
    };

    // Refetch data
    const refetchData = async () => {
        try {
            const eventsResponse = await fetch('/getEvents');
            const contestantsResponse = await fetch('/getContestants');
            
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                let processedEvents = [];
                if (Array.isArray(eventsData)) {
                    processedEvents = eventsData;
                } else if (eventsData && Array.isArray(eventsData.events)) {
                    processedEvents = eventsData.events;
                } else if (eventsData && Array.isArray(eventsData.data)) {
                    processedEvents = eventsData.data;
                }
                setEvents(processedEvents);
            }

            if (contestantsResponse.ok) {
                const contestantsData = await contestantsResponse.json();
                let processedContestants = [];
                if (Array.isArray(contestantsData)) {
                    processedContestants = contestantsData;
                } else if (contestantsData && Array.isArray(contestantsData.contestants)) {
                    processedContestants = contestantsData.contestants;
                } else if (contestantsData && Array.isArray(contestantsData.data)) {
                    processedContestants = contestantsData.data;
                }
                setContestants(processedContestants);
            }
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };

    // Submit handlers
    const handleAddContestantSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            console.log('Adding contestant with data:', formData);
            
            router.post('/addContestants', formData, {
                onSuccess: () => {
                    showAlert('success', 'Contestant added successfully!');
                    refetchData();
                    resolve();
                },
                onError: (errors) => {
                    console.error(errors);
                    showAlert('error', 'Failed to add contestant');
                    reject(errors);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        });

    const handleEditContestantSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            console.log('Updating contestant with data:', formData);
            
            router.patch(`/getEvents/${editingContestant.id}`, formData, {
                onSuccess: () => {
                    showAlert('success', 'Contestant updated successfully');
                    refetchData();
                    resolve();
                },
                onError: (errors) => {
                    showAlert('error', 'Failed to update contestant');
                    reject(errors);
                },
                onFinish: () => setProcessing(false)
            });
        });

    // Delete handler
    const handleDeleteContestant = async (contestantId) => {
        const confirmed = await confirmDialog(
            'Are you sure?',
            'This will delete the contestant permanently!',
            'Yes, delete it'
        );
        if (!confirmed) return;

        router.delete(`/getEvents/${contestantId}`, {
            onSuccess: () => {
                showAlert('success', 'Contestant deleted successfully');
                refetchData();
            },
            onError: () => showAlert('error', 'Failed to delete contestant'),
        });
    };

    // Badge components
    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Inactive
            </span>
        );
    };

    const getEventTypeBadge = (eventType) => {
        const typeConfig = {
            'Pageant': { color: 'bg-pink-100 text-pink-800' },
            'Singing': { color: 'bg-indigo-100 text-indigo-800' },
            'Dancing': { color: 'bg-orange-100 text-orange-800' },
        };

        const config = typeConfig[eventType] || { color: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : 'Unknown'}
            </span>
        );
    };

    // Round badge
    const getRoundBadge = (roundNo) => {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Round {roundNo}
            </span>
        );
    };

    // Display photo or placeholder
    const getPhotoDisplay = (photo) => {
        if (photo) {
            return (
                <img 
                    src={photo} 
                    alt="Contestant" 
                    className="w-10 h-10 rounded-full object-cover"
                />
            );
        }
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-500" />
            </div>
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
                        <h3 className="text-lg font-semibold">Error Loading Data</h3>
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
                {/* Header with Add Button */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                
                            </h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            {eventsWithContestants.length > 0 && (
                                <>
                                    <button
                                        onClick={expandAllEvents}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Expand All
                                    </button>
                                    <button
                                        onClick={collapseAllEvents}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Collapse All
                                    </button>
                                </>
                            )}
                            <PrimaryButton onClick={openAddContestant}>
                                <FaPlus className="mr-2" /> 
                                Add Contestant
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <div className="bg-white">
                        {eventsWithContestants.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <FaUser className="w-10 h-10 text-gray-300 mb-2" />
                                    <p>No contestants found</p>
                                    <p className="text-xs mt-1">Get started by creating a new contestant</p>
                                </div>
                            </div>
                        ) : (
                            eventsWithContestants.map((event) => {
                                const eventContestants = contestantsByEvent[event.id] || [];
                                const isExpanded = expandedEvents.has(event.id);
                                
                                return (
                                    <div key={event.id} className="border-b border-gray-200 last:border-b-0">
                                        {/* Event Header */}
                                        <div 
                                            className="px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                                            onClick={() => toggleEventExpansion(event.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {isExpanded ? (
                                                        <FaChevronDown className="w-4 h-4 text-gray-500 mr-2" />
                                                    ) : (
                                                        <FaChevronRight className="w-4 h-4 text-gray-500 mr-2" />
                                                    )}
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                                            <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {event.event_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {event.event_type} • {eventContestants.length} contestants
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getEventTypeBadge(event.event_type)}
                                                    {getStatusBadge(event.is_active)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contestants Table for this Event */}
                                        {isExpanded && (
                                            <div className="bg-gray-25">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                No.
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Photo
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Contestant Name
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Round No.
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {eventContestants.map((contestant, index) => (
                                                            <tr key={contestant.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="px-6 py-3 whitespace-nowrap">
                                                                    {getPhotoDisplay(contestant.photo)}
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <div className="flex items-center">
                                                                        <div className="ml-3">
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {contestant.contestant_name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-3 whitespace-nowrap">
                                                                    {getRoundBadge(contestant.round_no)}
                                                                </td>
                                                                <td className="px-6 py-3 whitespace-nowrap">
                                                                    {getStatusBadge(contestant.is_active)}
                                                                </td>
                                                                <td className="px-6 py-3 text-right whitespace-nowrap">
                                                                    <div className="flex items-center justify-end space-x-1">
                                                                        <button
                                                                            onClick={() => openEditContestant(contestant)}
                                                                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                                        >
                                                                            <FaEdit className="w-3 h-3 mr-1" />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteContestant(contestant.id)}
                                                                            className="inline-flex items-center px-2 py-1 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors duration-150"
                                                                        >
                                                                            <FaTrash className="w-3 h-3 mr-1" />
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Contestant Modals */}
            <FormModal
                show={showAddContestantModal}
                onClose={closeAddContestant}
                title="Add Contestant"
                fields={addContestantFields}
                onSubmit={handleAddContestantSubmit}
                submitText={processing ? 'Adding...' : 'Add Contestant'}
                processing={processing}
                formData={addContestantFormData}
                onFormChange={handleAddContestantFormChange}
                key={`add-contestant-${showAddContestantModal}`}
            />

            <FormModal
                show={showEditContestantModal}
                onClose={closeEditContestant}
                title={`Editing - ${editingContestant ? editingContestant.contestant_name : ''}`}
                initialData={editingContestant}
                fields={editContestantFields}
                onSubmit={handleEditContestantSubmit}
                submitText={processing ? 'Saving...' : 'Save Changes'}
                processing={processing}
                formData={editContestantFormData}
                onFormChange={handleEditContestantFormChange}
                key={`edit-contestant-${editingContestant?.id || 'none'}`}
            />
        </>
    );
}