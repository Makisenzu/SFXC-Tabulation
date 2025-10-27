import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
    FaEdit, 
    FaTrash, 
    FaPlus, 
    FaCalendarAlt, 
    FaListAlt, 
    FaEye, 
    FaEyeSlash,
    FaArchive,
    FaClock,
    FaChevronDown,
    FaChevronRight
} from 'react-icons/fa';
import Pagination from '@/Components/Pagination';
import FormModal from '@/Components/FormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { showAlert, confirmDialog } from '@/Sweetalert';

export default function EventCriteriaTable() {
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Modal states
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showEditEventModal, setShowEditEventModal] = useState(false);
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
    const [showEditCriteriaModal, setShowEditCriteriaModal] = useState(false);
    
    const [processing, setProcessing] = useState(false);
    
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingCriteria, setEditingCriteria] = useState(null);
    
    const [addEventFormData, setAddEventFormData] = useState({});
    const [editEventFormData, setEditEventFormData] = useState({});
    const [addCriteriaFormData, setAddCriteriaFormData] = useState({});
    const [editCriteriaFormData, setEditCriteriaFormData] = useState({});

    // State for expanded events in criteria tab
    const [expandedEvents, setExpandedEvents] = useState(new Set());

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'events') {
                    const response = await fetch('/getEvents');
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Events API Response:', data);
                    
                    if (Array.isArray(data)) {
                        setEvents(data);
                    } else if (data && Array.isArray(data.events)) {
                        setEvents(data.events);
                    } else if (data && Array.isArray(data.data)) {
                        setEvents(data.data);
                    } else {
                        console.warn('Unexpected events API response format:', data);
                        setEvents([]);
                    }
                } else {
                    const response = await fetch('/getCriterias');
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Criterias API Response:', data);
                    
                    if (Array.isArray(data)) {
                        setCriterias(data);
                    } else if (data && Array.isArray(data.criterias)) {
                        setCriterias(data.criterias);
                    } else if (data && Array.isArray(data.data)) {
                        setCriterias(data.data);
                    } else {
                        console.warn('Unexpected criterias API response format:', data);
                        setCriterias([]);
                    }
                }
                
            } catch (error) {
                console.error(`Error fetching ${activeTab}:`, error);
                setError(error.message);
                if (activeTab === 'events') {
                    setEvents([]);
                } else {
                    setCriterias([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const safeEvents = Array.isArray(events) ? events : [];
    const safeCriterias = Array.isArray(criterias) ? criterias : [];

    // Group criteria by event
    const criteriaByEvent = useMemo(() => {
        const grouped = {};
        safeCriterias.forEach(criteria => {
            const eventId = criteria.event_id;
            if (!grouped[eventId]) {
                grouped[eventId] = [];
            }
            grouped[eventId].push(criteria);
        });
        return grouped;
    }, [safeCriterias]);

    // Get events that have criteria
    const eventsWithCriteria = useMemo(() => {
        return safeEvents.filter(event => criteriaByEvent[event.id]?.length > 0);
    }, [safeEvents, criteriaByEvent]);

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
        const allEventIds = new Set(eventsWithCriteria.map(event => event.id));
        setExpandedEvents(allEventIds);
    };

    // Collapse all events
    const collapseAllEvents = () => {
        setExpandedEvents(new Set());
    };

    // Format date to Month/Day/Year with time
    const formatDateWithTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return `${formattedDate} ${formattedTime}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    // Format datetime for input field
    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            // Adjust for timezone offset to prevent date shifting
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() - timezoneOffset);
            return adjustedDate.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error formatting date for input:', error);
            return '';
        }
    };

    // Get round number from criteria
    const getRoundNumberFromCriteria = (criteria) => {
        return `Round ${criteria.valid_round || '1'}`;
    };

    // Event form fields
    const addEventFields = useMemo(() => ([
        {
            name: 'event_name',
            label: 'Event Name',
            type: 'text',
            required: true,
            placeholder: 'Enter event name'
        },
        {
            name: 'event_type',
            label: 'Event Type',
            type: 'select',
            options: [
                { value: 'Pageant', label: 'Pageant' },
                { value: 'Singing', label: 'Singing' },
                { value: 'Dancing', label: 'Dancing' },
            ],
            required: true
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            placeholder: 'Enter event description'
        },
        {
            name: 'event_start',
            label: 'Event Start',
            type: 'datetime-local',
            required: true
        },
        {
            name: 'event_end',
            label: 'Event End',
            type: 'datetime-local',
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

    const editEventFields = useMemo(() => ([
        {
            name: 'event_name',
            label: 'Event Name',
            type: 'text',
            required: true,
            placeholder: 'Enter event name'
        },
        {
            name: 'event_type',
            label: 'Event Type',
            type: 'select',
            options: [
                { value: 'Pageant', label: 'Pageant' },
                { value: 'Singing', label: 'Singing' },
                { value: 'Dancing', label: 'Dancing' },
            ],
            required: true
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            placeholder: 'Enter event description'
        },
        {
            name: 'event_start',
            label: 'Event Start',
            type: 'datetime-local',
            required: true
        },
        {
            name: 'event_end',
            label: 'Event End',
            type: 'datetime-local',
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
        },
        {
            name: 'is_archived',
            label: 'Archive Status',
            type: 'select',
            options: [
                { value: '1', label: 'Archived' },
                { value: '0', label: 'Not Archived' }
            ],
            required: true
        }
    ]), []);

    // Criteria form fields
    const addCriteriaFields = useMemo(() => ([
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
            name: 'criteria_desc',
            label: 'Criteria',
            type: 'text',
            required: true,
            placeholder: 'Enter criteria name'
        },
        {
            name: 'definition',
            label: 'Description',
            type: 'textarea',
            required: false,
            placeholder: 'Enter criteria definition'
        },
        {
            name: 'percentage',
            label: 'Criteria %',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
            step: 0.1,
            placeholder: 'Enter percentage (0-100)'
        },
        {
            name: 'valid_round',
            label: 'Round Number',
            type: 'number',
            required: true,
            min: 1,
            placeholder: 'Enter round number (e.g., 1, 2, 3)'
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

    const editCriteriaFields = useMemo(() => ([
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
            name: 'criteria_desc',
            label: 'Criteria',
            type: 'text',
            required: true,
            placeholder: 'Enter criteria description'
        },
        {
            name: 'definition',
            label: 'Description',
            type: 'textarea',
            required: false,
            placeholder: 'Enter criteria definition'
        },
        {
            name: 'percentage',
            label: 'Criteria %',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
            step: 0.1,
            placeholder: 'Enter percentage (0-100)'
        },
        {
            name: 'valid_round',
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

    // Modal handlers for Events
    const openAddEvent = () => {
        setAddEventFormData({
            event_name: '',
            event_type: '',
            description: '',
            event_start: '',
            event_end: '',
            is_active: '1',
            is_archived: '0'
        });
        setShowAddEventModal(true);
    };

    const closeAddEvent = () => {
        setShowAddEventModal(false);
        setAddEventFormData({});
    };

    const openEditEvent = (event) => {
        setEditingEvent(event);
        setEditEventFormData({
            event_name: event.event_name || '',
            event_type: event.event_type || '',
            description: event.description || '',
            event_start: event.event_start ? formatDateTimeForInput(event.event_start) : '',
            event_end: event.event_end ? formatDateTimeForInput(event.event_end) : '',
            is_active: event.is_active?.toString() || '1',
            is_archived: event.is_archived?.toString() || '0'
        });
        setShowEditEventModal(true);
    };

    const closeEditEvent = () => {
        setShowEditEventModal(false);
        setEditingEvent(null);
        setEditEventFormData({});
    };

    // Modal handlers for Criteria
    const openAddCriteria = () => {
        setAddCriteriaFormData({
            event_id: '',
            criteria_desc: '',
            definition: '',
            percentage: '',
            valid_round: '1',
            is_active: '1'
        });
        setShowAddCriteriaModal(true);
    };

    const closeAddCriteria = () => {
        setShowAddCriteriaModal(false);
        setAddCriteriaFormData({});
    };

    const openEditCriteria = (criteria) => {
        setEditingCriteria(criteria);
        setEditCriteriaFormData({
            event_id: criteria.event_id?.toString() || '',
            criteria_desc: criteria.criteria_desc || '',
            definition: criteria.definition || '',
            percentage: criteria.percentage?.toString() || '',
            valid_round: criteria.valid_round?.toString() || '1',
            is_active: criteria.is_active?.toString() || '1'
        });
        setShowEditCriteriaModal(true);
    };

    const closeEditCriteria = () => {
        setShowEditCriteriaModal(false);
        setEditingCriteria(null);
        setEditCriteriaFormData({});
    };

    // Form change handlers
    const handleAddEventFormChange = (formData) => {
        setAddEventFormData(formData);
    };

    const handleEditEventFormChange = (formData) => {
        setEditEventFormData(formData);
    };

    const handleAddCriteriaFormChange = (formData) => {
        setAddCriteriaFormData(formData);
    };

    const handleEditCriteriaFormChange = (formData) => {
        setEditCriteriaFormData(formData);
    };

    // Refetch data
    const refetchData = async () => {
        try {
            if (activeTab === 'events') {
                const response = await fetch('/getEvents');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setEvents(data);
                    } else if (data && Array.isArray(data.events)) {
                        setEvents(data.events);
                    } else if (data && Array.isArray(data.data)) {
                        setEvents(data.data);
                    }
                }
            } else {
                const response = await fetch('/getCriterias');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setCriterias(data);
                    } else if (data && Array.isArray(data.criterias)) {
                        setCriterias(data.criterias);
                    } else if (data && Array.isArray(data.data)) {
                        setCriterias(data.data);
                    }
                }
            }
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };

    // Submit handlers
    const handleAddEventSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            console.log('Adding event with data:', formData);
            
            router.post('/addEvent', formData, {
                onSuccess: () => {
                    showAlert('success', 'Event added successfully!');
                    refetchData();
                    resolve();
                },
                onError: (errors) => {
                    console.error(errors);
                    showAlert('error', 'Failed to add event');
                    reject(errors);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        });

    const handleEditEventSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            console.log('Updating event with data:', formData);
            
            router.put(`/events/${editingEvent.id}`, formData, {
                onSuccess: () => {
                    showAlert('success', 'Event updated successfully');
                    refetchData();
                    resolve();
                },
                onError: (errors) => {
                    showAlert('error', 'Failed to update event');
                    reject(errors);
                },
                onFinish: () => setProcessing(false)
            });
        });

    const handleAddCriteriaSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            console.log('Adding criteria with data:', formData);
            
            router.post('/criterias', formData, {
                onSuccess: () => {
                    showAlert('success', 'Criteria added successfully!');
                    refetchData();
                    resolve();
                },
                onError: (errors) => {
                    console.error(errors);
                    showAlert('error', 'Failed to add criteria');
                    reject(errors);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        });

    const handleEditCriteriaSubmit = (formData) =>
        new Promise((resolve, reject) => {
            setProcessing(true);
            
            console.log('Updating criteria with data:', formData);
            
            router.patch(`/criterias/${editingCriteria.id}`, formData, {
                onSuccess: () => {
                    showAlert('success', 'Criteria updated successfully');
                    refetchData();
                    resolve();
                },
                onError: (errors) => {
                    showAlert('error', 'Failed to update criteria');
                    reject(errors);
                },
                onFinish: () => setProcessing(false)
            });
        });

    // Delete handlers
    const handleDeleteEvent = async (eventId) => {
        const confirmed = await confirmDialog(
            'Are you sure?',
            'This will delete the event and all its criteria permanently!',
            'Yes, delete it'
        );
        if (!confirmed) return;

        router.delete(`/events/${eventId}`, {
            onSuccess: () => {
                showAlert('success', 'Event deleted successfully');
                refetchData();
            },
            onError: () => showAlert('error', 'Failed to delete event'),
        });
    };

    const handleDeleteCriteria = async (criteriaId) => {
        const confirmed = await confirmDialog(
            'Are you sure?',
            'This will delete the criteria permanently!',
            'Yes, delete it'
        );
        if (!confirmed) return;

        router.delete(`/criterias/${criteriaId}`, {
            onSuccess: () => {
                showAlert('success', 'Criteria deleted successfully');
                refetchData();
            },
            onError: () => showAlert('error', 'Failed to delete criteria'),
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

    const getArchiveBadge = (isArchived) => {
        return isArchived ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Archived
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Current
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

    // Percentage display
    const getPercentageDisplay = (percentage) => {
        return (
            <div className="text-center">
                <span className="text-lg font-semibold text-blue-600">
                    {percentage}%
                </span>
            </div>
        );
    };

    // Round badge
    const getRoundBadge = (criteria) => {
        const roundInfo = getRoundNumberFromCriteria(criteria);
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {roundInfo}
            </span>
        );
    };

    // Tab change handler
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Page change handler
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        <FaCalendarAlt className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => handleTabChange('events')}
                            className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                                activeTab === 'events'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <FaCalendarAlt className="mr-2" />
                            Events
                        </button>
                        <button
                            onClick={() => handleTabChange('criterias')}
                            className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                                activeTab === 'criterias'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <FaListAlt className="mr-2" />
                            Criteria
                        </button>
                    </nav>
                </div>

                {/* Header with Add Button */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {activeTab === 'events' ? 'Events Management' : 'Criteria Management'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            {activeTab === 'criterias' && eventsWithCriteria.length > 0 && (
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
                            <PrimaryButton 
                                onClick={activeTab === 'events' ? openAddEvent : openAddCriteria}
                            >
                                <FaPlus className="mr-2" /> 
                                Add {activeTab === 'events' ? 'Event' : 'Criteria'}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {activeTab === 'events' ? (
                        // Events Table
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event Details
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
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
                                {safeEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <FaCalendarAlt className="w-10 h-10 text-gray-300 mb-2" />
                                                <p>No events found</p>
                                                <p className="text-xs mt-1">Get started by creating a new event</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    safeEvents.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                                        <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.event_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {item.description || 'No description'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getEventTypeBadge(item.event_type)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900 space-y-2">
                                                    <div className="flex items-start space-x-2">
                                                        <FaClock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <div className="font-medium text-gray-700">Start:</div>
                                                            <div>{formatDateWithTime(item.event_start)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-2">
                                                        <FaClock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <div className="font-medium text-gray-700">End:</div>
                                                            <div>{formatDateWithTime(item.event_end)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col space-y-1">
                                                    {getStatusBadge(item.is_active)}
                                                    {getArchiveBadge(item.is_archived)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button
                                                        onClick={() => openEditEvent(item)}
                                                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                    >
                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(item.id)}
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
                    ) : (
                        // Criteria Table - Grouped by Event
                        <div className="bg-white">
                            {eventsWithCriteria.length === 0 ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <FaListAlt className="w-10 h-10 text-gray-300 mb-2" />
                                        <p>No criteria found</p>
                                        <p className="text-xs mt-1">Get started by creating a new criteria</p>
                                    </div>
                                </div>
                            ) : (
                                eventsWithCriteria.map((event) => {
                                    const eventCriteria = criteriaByEvent[event.id] || [];
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
                                                                    {event.event_type} • {eventCriteria.length} criteria
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusBadge(event.is_active)}
                                                        {getArchiveBadge(event.is_archived)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Criteria Table for this Event */}
                                            {isExpanded && (
                                                <div className="bg-gray-25">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Criteria
                                                                </th>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Description
                                                                </th>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Criteria %
                                                                </th>
                                                                <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Valid Round
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
                                                            {eventCriteria.map((criteria) => (
                                                                <tr key={criteria.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                                    <td className="px-6 py-3">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 rounded-full">
                                                                                <FaListAlt className="w-3 h-3 text-green-600" />
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <div className="text-sm font-medium text-gray-900">
                                                                                    {criteria.criteria_desc}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-3">
                                                                        <div className="text-sm text-gray-600 max-w-xs">
                                                                            {criteria.definition || 'No description provided'}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-3">
                                                                        {getPercentageDisplay(criteria.percentage)}
                                                                    </td>
                                                                    <td className="px-6 py-3">
                                                                        {getRoundBadge(criteria)}
                                                                    </td>
                                                                    <td className="px-6 py-3">
                                                                        {getStatusBadge(criteria.is_active)}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-right">
                                                                        <div className="flex items-center justify-end space-x-1">
                                                                            <button
                                                                                onClick={() => openEditCriteria(criteria)}
                                                                                className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                                            >
                                                                                <FaEdit className="w-3 h-3 mr-1" />
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteCriteria(criteria.id)}
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
                    )}
                </div>

                {/* Pagination - Only for events tab */}
                {activeTab === 'events' && safeEvents.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{Math.min(safeEvents.length, 1)}</span> to{' '}
                                <span className="font-medium">{safeEvents.length}</span> of{' '}
                                <span className="font-medium">{safeEvents.length}</span> events
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Modals */}
            <FormModal
                show={showAddEventModal}
                onClose={closeAddEvent}
                title="Add Event"
                fields={addEventFields}
                onSubmit={handleAddEventSubmit}
                submitText={processing ? 'Adding...' : 'Add Event'}
                processing={processing}
                formData={addEventFormData}
                onFormChange={handleAddEventFormChange}
                key={`add-event-${showAddEventModal}`}
            />

            <FormModal
                show={showEditEventModal}
                onClose={closeEditEvent}
                title={`Editing - ${editingEvent ? editingEvent.event_name : ''}`}
                initialData={editingEvent}
                fields={editEventFields}
                onSubmit={handleEditEventSubmit}
                submitText={processing ? 'Saving...' : 'Save Changes'}
                processing={processing}
                formData={editEventFormData}
                onFormChange={handleEditEventFormChange}
                key={`edit-event-${editingEvent?.id || 'none'}`}
            />

            {/* Criteria Modals */}
            <FormModal
                show={showAddCriteriaModal}
                onClose={closeAddCriteria}
                title="Add Criteria"
                fields={addCriteriaFields}
                onSubmit={handleAddCriteriaSubmit}
                submitText={processing ? 'Adding...' : 'Add Criteria'}
                processing={processing}
                formData={addCriteriaFormData}
                onFormChange={handleAddCriteriaFormChange}
                key={`add-criteria-${showAddCriteriaModal}`}
            />

            <FormModal
                show={showEditCriteriaModal}
                onClose={closeEditCriteria}
                title={`Editing - ${editingCriteria ? editingCriteria.criteria_desc : ''}`}
                initialData={editingCriteria}
                fields={editCriteriaFields}
                onSubmit={handleEditCriteriaSubmit}
                submitText={processing ? 'Saving...' : 'Save Changes'}
                processing={processing}
                formData={editCriteriaFormData}
                onFormChange={handleEditCriteriaFormChange}
                key={`edit-criteria-${editingCriteria?.id || 'none'}`}
            />
        </>
    );
}