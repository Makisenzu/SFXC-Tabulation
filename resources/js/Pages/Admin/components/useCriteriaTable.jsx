import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { showAlert, confirmDialog } from '@/Sweetalert';

export function useCriteriaTable() {
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [criterias, setCriterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showEditEventModal, setShowEditEventModal] = useState(false);
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
    const [showEditCriteriaModal, setShowEditCriteriaModal] = useState(false);
    const [showAddJudgesModal, setShowAddJudgesModal] = useState(false);
    
    const [processing, setProcessing] = useState(false);
    
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingCriteria, setEditingCriteria] = useState(null);
    const [selectedEventForJudges, setSelectedEventForJudges] = useState(null);
    
    const [addEventFormData, setAddEventFormData] = useState({});
    const [editEventFormData, setEditEventFormData] = useState({});
    const [addCriteriaFormData, setAddCriteriaFormData] = useState({});
    const [editCriteriaFormData, setEditCriteriaFormData] = useState({});

    const [expandedEvents, setExpandedEvents] = useState(new Set());
    const [showPastEvents, setShowPastEvents] = useState(false);
    const [eventsPagination, setEventsPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const safeEvents = Array.isArray(events) ? events : [];
    const safeCriterias = Array.isArray(criterias) ? criterias : [];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'events') {
                    const response = await fetch(`/getEvents?page=${eventsPagination.current_page}&per_page=10&show_past=${showPastEvents}`);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Events API Response:', data);
                    
                    // Handle paginated response
                    if (data && Array.isArray(data.data)) {
                        setEvents(data.data);
                        setEventsPagination({
                            current_page: data.current_page,
                            last_page: data.last_page,
                            per_page: data.per_page,
                            total: data.total
                        });
                    } else if (Array.isArray(data)) {
                        setEvents(data);
                    } else if (data && Array.isArray(data.events)) {
                        setEvents(data.events);
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
    }, [activeTab, showPastEvents, eventsPagination.current_page]);

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

    const eventsWithCriteria = useMemo(() => {
        return safeEvents.filter(event => criteriaByEvent[event.id]?.length > 0);
    }, [safeEvents, criteriaByEvent]);

    // Separate current/future events from past events
    const { currentEvents, pastEvents } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const current = [];
        const past = [];

        safeEvents.forEach(event => {
            const eventStart = new Date(event.event_start);
            const eventEnd = new Date(event.event_end);
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(0, 0, 0, 0);

            // Event is current if it starts today/future OR ends today/future
            if (eventStart >= today || eventEnd >= today) {
                current.push(event);
            } else {
                past.push(event);
            }
        });

        return { currentEvents: current, pastEvents: past };
    }, [safeEvents]);

    // Separate current/past events with criteria for Criteria tab
    const { currentEventsWithCriteria, pastEventsWithCriteria } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const current = [];
        const past = [];

        eventsWithCriteria.forEach(event => {
            const eventStart = new Date(event.event_start);
            const eventEnd = new Date(event.event_end);
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(0, 0, 0, 0);

            // Event is current if it starts today/future OR ends today/future
            if (eventStart >= today || eventEnd >= today) {
                current.push(event);
            } else {
                past.push(event);
            }
        });

        return { currentEventsWithCriteria: current, pastEventsWithCriteria: past };
    }, [eventsWithCriteria]);

    const toggleEventExpansion = (eventId) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    const expandAllEvents = () => {
        const eventsToExpand = activeTab === 'criterias' 
            ? [...currentEventsWithCriteria, ...(showPastEvents ? pastEventsWithCriteria : [])]
            : [...currentEvents, ...(showPastEvents ? pastEvents : [])];
        const allEventIds = new Set(eventsToExpand.map(event => event.id));
        setExpandedEvents(allEventIds);
    };

    const collapseAllEvents = () => {
        setExpandedEvents(new Set());
    };

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

    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() - timezoneOffset);
            return adjustedDate.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error formatting date for input:', error);
            return '';
        }
    };

    const getRoundNumberFromCriteria = (criteria) => {
        return `Round ${criteria.valid_round || '1'}`;
    };

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
                { value: 'Others', label: 'Others' },
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
                { value: 'Others', label: 'Others' },
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

    const addCriteriaFields = useMemo(() => ([
        {
            name: 'event_id',
            label: 'Event',
            type: 'select',
            options: currentEvents
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
    ]), [currentEvents]);

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

    // Judges modal handlers
    const openAddJudges = (event) => {
        setSelectedEventForJudges(event);
        setShowAddJudgesModal(true);
    };

    const closeAddJudgesModal = () => {
        setShowAddJudgesModal(false);
        setSelectedEventForJudges(null);
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
    const getStatusBadge = (isActive, event = null) => {
        // If event is provided, check if it's a past event
        if (event) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const eventStart = new Date(event.event_start);
            const eventEnd = new Date(event.event_end);
            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(0, 0, 0, 0);
            
            // If event has ended (past event), always show as inactive
            if (eventStart < today && eventEnd < today) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                    </span>
                );
            }
        }
        
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white-100 text-black-800">
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

    return {
        // State
        activeTab,
        safeEvents,
        safeCriterias,
        eventsWithCriteria,
        criteriaByEvent,
        currentEvents,
        pastEvents,
        currentEventsWithCriteria,
        pastEventsWithCriteria,
        loading,
        error,
        expandedEvents,
        showAddEventModal,
        showEditEventModal,
        showAddCriteriaModal,
        showEditCriteriaModal,
        showAddJudgesModal,
        processing,
        editingEvent,
        editingCriteria,
        selectedEventForJudges,
        addEventFormData,
        editEventFormData,
        addCriteriaFormData,
        editCriteriaFormData,
        showPastEvents,
        setShowPastEvents,
        eventsPagination,
        setEventsPagination,
        
        // Form fields
        addEventFields,
        editEventFields,
        addCriteriaFields,
        editCriteriaFields,
        
        // Functions
        toggleEventExpansion,
        expandAllEvents,
        collapseAllEvents,
        formatDateWithTime,
        getStatusBadge,
        getArchiveBadge,
        getEventTypeBadge,
        getPercentageDisplay,
        getRoundBadge,
        handleTabChange,
        handlePageChange,
        openAddEvent,
        closeAddEvent,
        openEditEvent,
        closeEditEvent,
        openAddCriteria,
        closeAddCriteria,
        openEditCriteria,
        closeEditCriteria,
        openAddJudges,
        closeAddJudgesModal,
        handleAddEventFormChange,
        handleEditEventFormChange,
        handleAddCriteriaFormChange,
        handleEditCriteriaFormChange,
        handleAddEventSubmit,
        handleEditEventSubmit,
        handleAddCriteriaSubmit,
        handleEditCriteriaSubmit,
        handleDeleteEvent,
        handleDeleteCriteria
    };
}