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
    FaPercentage,
    FaClock,
    FaHashtag
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

    // Pagination logic
    const currentData = activeTab === 'events' ? safeEvents : safeCriterias;
    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);

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

    // Get event name from active_id
    const getEventNameFromActiveId = (activeId) => {
        if (!activeId) return 'No Event';
        const event = safeEvents.find(event => event.active_id === activeId || event.id === activeId);
        return event ? event.event_name : 'Unknown Event';
    };

    // Get round number from active_id
    const getRoundNumberFromActiveId = (activeId) => {
        if (!activeId) return 'No Round';
        const event = safeEvents.find(event => event.active_id === activeId || event.id === activeId);
        return event ? `Round ${event.round_no || '1'}` : 'Unknown Round';
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
            name: 'active_id',
            label: 'Valid Round',
            type: 'select',
            options: safeEvents
                .filter(event => event.is_active)
                .map(event => ({
                    value: event.active_id || event.id,
                    // label: `${event.event_name} (Round ${event.round_no || '1'})`
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
            name: 'max_percentage',
            label: 'Max Percentage',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
            step: 0.1,
            placeholder: 'Enter max percentage (0-100)'
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
            name: 'active_id',
            label: 'Valid Round',
            type: 'select',
            options: safeEvents
                .filter(event => event.is_active)
                .map(event => ({
                    value: event.active_id || event.id,
                    label: `${event.event_name} (Round ${event.round_no || '1'})`
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
            name: 'max_percentage',
            label: 'Max Percentage',
            type: 'number',
            required: true,
            min: 0,
            max: 100,
            step: 0.1,
            placeholder: 'Enter max percentage (0-100)'
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
            active_id: '',
            criteria_desc: '',
            definition: '',
            percentage: '',
            max_percentage: '',
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
            active_id: criteria.active_id?.toString() || '',
            criteria_desc: criteria.criteria_desc || '',
            definition: criteria.definition || '',
            percentage: criteria.percentage?.toString() || '',
            max_percentage: criteria.max_percentage?.toString() || '',
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
            'This will delete the event permanently!',
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

    const getArchiveBadge = (isArchived) => {
        return isArchived ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <FaArchive className="w-3 h-3 mr-1" />
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

    const getPercentageBadge = (percentage) => {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <FaPercentage className="w-3 h-3 mr-1" />
                {percentage}%
            </span>
        );
    };

    const getRoundBadge = (activeId) => {
        const roundInfo = getRoundNumberFromActiveId(activeId);
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <FaHashtag className="w-3 h-3 mr-1" />
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
                        <PrimaryButton 
                            onClick={activeTab === 'events' ? openAddEvent : openAddCriteria}
                        >
                            <FaPlus className="mr-2" /> 
                            Add {activeTab === 'events' ? 'Event' : 'Criteria'}
                        </PrimaryButton>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {activeTab === 'events' ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Criteria
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Criteria %
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valid Round
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={activeTab === 'events' ? "5" : "6"} className="px-4 py-6 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            {activeTab === 'events' ? (
                                                <>
                                                    <FaCalendarAlt className="w-10 h-10 text-gray-300 mb-2" />
                                                    <p>No events found</p>
                                                    <p className="text-xs mt-1">Get started by creating a new event</p>
                                                </>
                                            ) : (
                                                <>
                                                    <FaListAlt className="w-10 h-10 text-gray-300 mb-2" />
                                                    <p>No criteria found</p>
                                                    <p className="text-xs mt-1">Get started by creating a new criteria</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        {activeTab === 'events' ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                                                            <FaListAlt className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.criteria_desc}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-600 max-w-xs">
                                                        {item.definition || 'No description provided'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col space-y-1">
                                                        {getPercentageBadge(item.percentage)}
                                                        <span className="text-xs text-gray-500">
                                                            Max: {item.max_percentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col space-y-1">
                                                        {getRoundBadge(item.active_id)}
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            {getEventNameFromActiveId(item.active_id)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(item.is_active)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <button
                                                            onClick={() => openEditCriteria(item)}
                                                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                        >
                                                            <FaEdit className="w-3 h-3 mr-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCriteria(item.id)}
                                                            className="inline-flex items-center px-2 py-1 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors duration-150"
                                                        >
                                                            <FaTrash className="w-3 h-3 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {currentData.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, currentData.length)}
                                </span> of{' '}
                                <span className="font-medium">{currentData.length}</span> {activeTab}
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