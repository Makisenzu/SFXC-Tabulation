// File: RoundManagementTable.jsx
import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
    Trash2, 
    Plus, 
    Calendar, 
    User,
    ChevronDown,
    ChevronRight,
    Image as ImageIcon,
    Play,
    Database,
    Check,
    RefreshCw,
    Users,
    Award,
    Filter,
    AlertCircle
} from 'lucide-react';
import { showAlert, confirmDialog } from '@/Sweetalert';

export default function RoundManagementTable() {
    const [events, setEvents] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [roundContestants, setRoundContestants] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddContestantRoundModal, setShowAddContestantRoundModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedEventForRound, setSelectedEventForRound] = useState(null);
    const [expandedEvents, setExpandedEvents] = useState(new Set());
    const [selectedRounds, setSelectedRounds] = useState({});

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const eventsResponse = await fetch('/getEvents');
                if (!eventsResponse.ok) throw new Error(`HTTP error! status: ${eventsResponse.status}`);
                const eventsData = await eventsResponse.json();
                
                const contestantsResponse = await fetch('/getContestants');
                if (!contestantsResponse.ok) throw new Error(`HTTP error! status: ${contestantsResponse.status}`);
                const contestantsData = await contestantsResponse.json();

                let processedEvents = Array.isArray(eventsData) ? eventsData : 
                    eventsData?.events || eventsData?.data || [];
                setEvents(processedEvents);

                let processedContestants = Array.isArray(contestantsData) ? contestantsData :
                    contestantsData?.contestants || contestantsData?.data || [];
                setContestants(processedContestants);

                const roundsPromises = processedEvents.map(event => 
                    fetch(`/getActiveRounds/${event.id}`).then(res => res.json())
                );
                const roundsResults = await Promise.all(roundsPromises);
                
                const allRounds = {};
                processedEvents.forEach((event, index) => {
                    allRounds[event.id] = roundsResults[index];
                });
                setRounds(allRounds);

                await fetchRoundContestants(processedEvents, allRounds);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setEvents([]);
                setContestants([]);
                setRounds({});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchRoundContestants = async (events, roundsData) => {
        try {
            const roundContestantsData = {};
            
            for (const event of events) {
                const eventRounds = roundsData[event.id] || [];
                roundContestantsData[event.id] = {};
                
                for (const round of eventRounds) {
                    const response = await fetch(`/get-round-contestants/${event.id}/${round.round_no}`);
                    if (response.ok) {
                        const contestantsData = await response.json();
                        roundContestantsData[event.id][round.round_no] = contestantsData;
                    } else {
                        roundContestantsData[event.id][round.round_no] = [];
                    }
                }
            }
            
            setRoundContestants(roundContestantsData);
        } catch (error) {
            console.error('Error fetching round contestants:', error);
        }
    };

    const safeEvents = Array.isArray(events) ? events : [];
    const safeContestants = Array.isArray(contestants) ? contestants : [];

    const contestantsByEvent = useMemo(() => {
        const grouped = {};
        safeContestants.forEach(contestant => {
            const eventId = contestant.event_id;
            if (!grouped[eventId]) grouped[eventId] = [];
            grouped[eventId].push(contestant);
        });
        return grouped;
    }, [safeContestants]);

    const eventsWithContestants = useMemo(() => {
        return safeEvents.filter(event => contestantsByEvent[event.id]?.length > 0);
    }, [safeEvents, contestantsByEvent]);

    const getContestantsForSelectedRound = (eventId) => {
        const selectedRound = selectedRounds[eventId];
        if (!selectedRound) return [];
        const eventRoundContestants = roundContestants[eventId] || {};
        return eventRoundContestants[selectedRound] || [];
    };

    const toggleEventExpansion = (eventId) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    const handleRoundChange = async (eventId, roundNo) => {
        setSelectedRounds(prev => ({ ...prev, [eventId]: roundNo }));
        if (roundNo) await refreshRoundContestants(eventId, roundNo);
    };

    const refreshRoundContestants = async (eventId, roundNo) => {
        try {
            const response = await fetch(`/get-round-contestants/${eventId}/${roundNo}`);
            if (response.ok) {
                const contestantsData = await response.json();
                setRoundContestants(prev => ({
                    ...prev,
                    [eventId]: { ...prev[eventId], [roundNo]: contestantsData }
                }));
            }
        } catch (error) {
            console.error('Error refreshing round contestants:', error);
        }
    };

    const expandAllEvents = () => {
        const allEventIds = new Set(eventsWithContestants.map(event => event.id));
        setExpandedEvents(allEventIds);
    };

    const collapseAllEvents = () => setExpandedEvents(new Set());

    const openAddContestantRound = (event) => {
        setSelectedEventForRound(event);
        setShowAddContestantRoundModal(true);
    };

    const closeAddContestantRound = () => {
        setShowAddContestantRoundModal(false);
        setSelectedEventForRound(null);
    };

    const refetchData = async () => {
        try {
            const eventsResponse = await fetch('/getEvents');
            const contestantsResponse = await fetch('/getContestants');
            
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                let processedEvents = Array.isArray(eventsData) ? eventsData :
                    eventsData?.events || eventsData?.data || [];
                setEvents(processedEvents);
            }

            if (contestantsResponse.ok) {
                const contestantsData = await contestantsResponse.json();
                let processedContestants = Array.isArray(contestantsData) ? contestantsData :
                    contestantsData?.contestants || contestantsData?.data || [];
                setContestants(processedContestants);
            }

            const roundsPromises = safeEvents.map(event => 
                fetch(`/getActiveRounds/${event.id}`).then(res => res.json())
            );
            const roundsResults = await Promise.all(roundsPromises);
            
            const allRounds = {};
            safeEvents.forEach((event, index) => {
                allRounds[event.id] = roundsResults[index];
            });
            setRounds(allRounds);

            await fetchRoundContestants(safeEvents, allRounds);
            
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };

    const handleSetActiveRound = async (eventId, roundNo) => {
        const confirmed = await confirmDialog(
            'Set Active Round?',
            `This will set Round ${roundNo} as the active round for this event.`,
            'Yes, set as active'
        );
        if (!confirmed) return;

        setProcessing(true);
        try {
            router.patch(`/events/${eventId}/set-active-round`, { round_no: roundNo }, {
                onSuccess: () => {
                    showAlert('success', `Round ${roundNo} set as active!`);
                    refetchData();
                },
                onError: () => showAlert('error', 'Failed to set active round'),
                onFinish: () => setProcessing(false)
            });
        } catch (error) {
            console.error('Error setting active round:', error);
            setProcessing(false);
        }
    };

    const handlePopulateTabulationCriteria = async (eventId, roundNo) => {
        const confirmed = await confirmDialog(
            'Populate Tabulation Criteria?',
            `This will prepare Round ${roundNo} for judging by showing contestants and criteria to judges.`,
            'Yes, populate for judges'
        );
        if (!confirmed) return;
    
        setProcessing(true);
        
        router.post(`/events/${eventId}/populate-criteria`, { 
            round_no: roundNo 
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.success) {
                    const data = page.props.populatedData || page.props.data;
                    if (data) {
                        showAlert('success', 
                            `Tabulation ready for judges! 
                            ${data.summary.total_contestants} contestants and 
                            ${data.summary.total_criteria} criteria loaded for Round ${roundNo}.`
                        );
                    } else {
                        showAlert('success', page.props.message || 'Tabulation criteria populated successfully!');
                    }
                }
            },
            onError: (errors) => {
                if (errors.message) {
                    showAlert('error', errors.message);
                } else {
                    showAlert('error', 'Failed to populate tabulation criteria');
                }
            },
            onFinish: () => setProcessing(false)
        });
    };

    const handleDeleteContestantRound = async (contestantId, roundNo, eventId) => {
        const confirmed = await confirmDialog(
            'Remove from Round?',
            `This will remove the contestant from Round ${roundNo}. This action cannot be undone.`,
            'Yes, remove from round'
        );
        if (!confirmed) return;

        try {
            router.delete(`/contestant-rounds/${contestantId}`, { 
                data: { round_no: roundNo, event_id: eventId } 
            }, {
                onSuccess: () => {
                    showAlert('success', 'Contestant removed from round successfully');
                    refreshRoundContestants(eventId, roundNo);
                },
                onError: () => showAlert('error', 'Failed to remove contestant from round'),
            });
        } catch (error) {
            console.error('Error deleting contestant from round:', error);
        }
    };

    const AddMultipleContestantsModal = () => {
        const [selectedContestants, setSelectedContestants] = useState(new Set());
        const [selectedRound, setSelectedRound] = useState('');
        const [searchQuery, setSearchQuery] = useState('');

        if (!selectedEventForRound) return null;

        const eventContestants = contestantsByEvent[selectedEventForRound.id] || [];
        const eventRounds = rounds[selectedEventForRound.id] || [];

        const contestantsInSelectedRound = selectedRound ? 
            (roundContestants[selectedEventForRound.id]?.[selectedRound] || []) : [];
        
        const contestantIdsInRound = new Set(contestantsInSelectedRound.map(c => c.id));
        const availableContestants = eventContestants.filter(contestant => 
            !contestantIdsInRound.has(contestant.id) &&
            contestant.contestant_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handleContestantToggle = (contestantId) => {
            const newSelected = new Set(selectedContestants);
            if (newSelected.has(contestantId)) {
                newSelected.delete(contestantId);
            } else {
                newSelected.add(contestantId);
            }
            setSelectedContestants(newSelected);
        };

        const handleSelectAll = () => {
            if (selectedContestants.size === availableContestants.length) {
                setSelectedContestants(new Set());
            } else {
                setSelectedContestants(new Set(availableContestants.map(c => c.id)));
            }
        };

        const handleSubmit = () => {
            if (selectedContestants.size === 0) {
                showAlert('error', 'Please select at least one contestant');
                return;
            }
            if (!selectedRound) {
                showAlert('error', 'Please select a round');
                return;
            }

            setProcessing(true);
            
            const payload = {
                contestant_ids: Array.from(selectedContestants),
                round_no: selectedRound,
                event_id: selectedEventForRound.id
            };
            
            router.post('/contestant-rounds/bulk', payload, {
                onSuccess: () => {
                    showAlert('success', `${selectedContestants.size} contestant(s) added to round successfully!`);
                    refetchData();
                    closeAddContestantRound();
                    setSelectedContestants(new Set());
                    setSelectedRound('');
                },
                onError: () => showAlert('error', 'Failed to add contestants to round'),
                onFinish: () => setProcessing(false)
            });
        };

        const handleClose = () => {
            closeAddContestantRound();
            setSelectedContestants(new Set());
            setSelectedRound('');
            setSearchQuery('');
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm">
                <div className="relative w-full max-w-3xl p-6 mx-auto">
                    <div className="relative bg-white rounded-2xl shadow-2xl">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Add Contestants to Round
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {selectedEventForRound.event_name}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="px-8 py-6 space-y-6">
                            {/* Round Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Round
                                </label>
                                <select
                                    value={selectedRound}
                                    onChange={(e) => {
                                        setSelectedRound(e.target.value);
                                        setSelectedContestants(new Set());
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Choose a round</option>
                                    {eventRounds.map(round => (
                                        <option key={round.round_no} value={round.round_no}>
                                            Round {round.round_no} {round.is_active ? '(Active)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search Bar */}
                            {selectedRound && availableContestants.length > 0 && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search contestants..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                                    />
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                            )}

                            {/* Contestants Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Select Contestants
                                    </label>
                                    {availableContestants.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                        >
                                            {selectedContestants.size === availableContestants.length 
                                                ? 'Deselect All' 
                                                : 'Select All'}
                                        </button>
                                    )}
                                </div>
                                
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="max-h-96 overflow-y-auto">
                                        {availableContestants.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    {selectedRound ? (
                                                        <AlertCircle className="h-8 w-8 text-gray-400" />
                                                    ) : (
                                                        <User className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <p className="text-gray-500 font-medium">
                                                    {selectedRound 
                                                        ? searchQuery 
                                                            ? 'No contestants match your search'
                                                            : 'No available contestants for this round'
                                                        : 'Please select a round first'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {availableContestants.map(contestant => (
                                                    <label 
                                                        key={contestant.id}
                                                        className="flex items-center px-5 py-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedContestants.has(contestant.id)}
                                                            onChange={() => handleContestantToggle(contestant.id)}
                                                            className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                                        />
                                                        <span className="ml-4 text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                            {contestant.contestant_name}
                                                            {contestant.sequence_no && (
                                                                <span className="ml-2 text-xs text-gray-500 font-normal">
                                                                    No. {contestant.sequence_no}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedContestants.size > 0 && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                                            {selectedContestants.size} Selected
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing || selectedContestants.size === 0 || !selectedRound}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Check className="w-4 h-4"/>
                                {processing ? 'Adding...' : `Add ${selectedContestants.size} Contestant${selectedContestants.size !== 1 ? 's' : ''}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                Inactive
            </span>
        );
    };

    const getEventTypeBadge = (eventType) => {
        const typeConfig = {
            'Pageant': { color: 'bg-pink-50 text-pink-700' },
            'Singing': { color: 'bg-indigo-50 text-indigo-700' },
            'Dancing': { color: 'bg-orange-50 text-orange-700' },
        };

        const config = typeConfig[eventType] || { color: 'bg-gray-100 text-gray-600' };

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${config.color}`}>
                {eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : 'Unknown'}
            </span>
        );
    };

    const getPhotoDisplay = (photo) => {
        if (photo) {
            const photoUrl = `/storage/${photo}`;
            return (
                <div className="relative group">
                    <img 
                        src={photoUrl} 
                        alt="Contestant" 
                        className="w-14 h-18 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"></div>
                </div>
            );
        }
        return (
            <div className="w-14 h-18 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-5 h-5 mb-0.5" />
                <span className="text-xs">No Photo</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
                <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                {/* <Award className="h-6 w-6 text-blue-600" /> */}
                            </div>
                            <div>
                                {/* <h2 className="text-xl font-bold text-gray-900">Round Management</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Manage contestants per competition round</p> */}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {eventsWithContestants.length > 0 && (
                                <>
                                    <button
                                        onClick={expandAllEvents}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                        Expand All
                                    </button>
                                    <button
                                        onClick={collapseAllEvents}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                        Collapse All
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-100">
                    {eventsWithContestants.length === 0 ? (
                        <div className="px-6 py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contestants Found</h3>
                            <p className="text-gray-500">Add contestants to events to manage rounds</p>
                        </div>
                    ) : (
                        eventsWithContestants.map((event) => {
                            const eventRounds = rounds[event.id] || [];
                            const isExpanded = expandedEvents.has(event.id);
                            const selectedRound = selectedRounds[event.id];
                            const roundContestantsList = selectedRound ? getContestantsForSelectedRound(event.id) : [];
                            
                            return (
                                <div key={event.id}>
                                    {/* Event Header */}
                                    <div 
                                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => toggleEventExpansion(event.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="p-3 bg-green-100 rounded-xl">
                                                        {/* <Calendar className="w-5 h-5 text-blue-600" /> */}
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-semibold text-gray-900">
                                                            {event.event_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-0.5">
                                                            {contestantsByEvent[event.id]?.length || 0} contestants registered
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getEventTypeBadge(event.event_type)}
                                                {getStatusBadge(event.is_active)}
                                            </div>
                                        </div>

                                        {/* Round Controls */}
                                        {isExpanded && (
                                            <div className="mt-5 pt-5 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <label className="text-sm font-semibold text-gray-700">
                                                            Round:
                                                        </label>
                                                        <select
                                                            value={selectedRound || ''}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleRoundChange(event.id, e.target.value);
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        >
                                                            <option value="">Select Round</option>
                                                            {eventRounds.map(round => (
                                                                <option key={round.round_no} value={round.round_no}>
                                                                    Round {round.round_no} {round.is_active ? '(Active)' : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openAddContestantRound(event);
                                                            }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Add Contestants
                                                        </button>
                                                        {selectedRound && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSetActiveRound(event.id, selectedRound);
                                                                    }}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors"
                                                                >
                                                                    <Play className="w-4 h-4" />
                                                                    Set Active
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePopulateTabulationCriteria(event.id, selectedRound);
                                                                    }}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors"
                                                                >
                                                                    <Database className="w-4 h-4" />
                                                                    Populate Criteria
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contestants Table */}
                                    {isExpanded && selectedRound && (
                                        <div className="bg-gray-50">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                No.
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Photo
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Contestant
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Round
                                                            </th>
                                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-100">
                                                        {roundContestantsList.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="5" className="px-6 py-12">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                                                                            <User className="w-8 h-8 text-gray-400" />
                                                                        </div>
                                                                        <p className="text-sm font-medium text-gray-600">
                                                                            No contestants in Round {selectedRound}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            Add contestants to this round to get started
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            roundContestantsList.map((contestant, index) => (
                                                                <tr key={contestant.id} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="text-sm font-semibold text-gray-900">
                                                                            {index + 1}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        {getPhotoDisplay(contestant.photo)}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="text-sm font-semibold text-gray-900">
                                                                            {contestant.contestant_name}
                                                                        </div>
                                                                        {contestant.sequence_no && (
                                                                            <div className="text-xs text-gray-500 mt-1">
                                                                                Sequence No. {contestant.sequence_no}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                                                                            Round {selectedRound}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                                        <button
                                                                            onClick={() => handleDeleteContestantRound(contestant.id, selectedRound, event.id)}
                                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                            Remove
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {showAddContestantRoundModal && <AddMultipleContestantsModal />}
        </>
    );
}