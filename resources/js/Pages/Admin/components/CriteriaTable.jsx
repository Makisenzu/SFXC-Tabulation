import axios from 'axios';
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
    FaChevronRight,
} from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import Pagination from '@/Components/Pagination';
import FormModal from '@/Components/FormModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { useCriteriaTable } from './useCriteriaTable';
import AddMultipleJudgesModal from './AddMultipleJudgesModal';

export default function CriteriaTable() {
    const {
        // State
        activeTab,
        safeEvents,
        safeCriterias,
        eventsWithCriteria,
        criteriaByEvent,
        currentEvents,
        pastEvents,
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
    } = useCriteriaTable();

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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {activeTab === 'events' ? 'Events Management' : 'Criteria Management'}
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
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
                                className="w-full sm:w-auto"
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
                        // Events Table - Hidden on mobile, shown on desktop
                        <>
                            {/* Mobile Card View */}
                            <div className="block md:hidden">
                                {currentEvents.length === 0 && pastEvents.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaCalendarAlt className="w-10 h-10 text-gray-300 mb-2" />
                                            <p>No events found</p>
                                            <p className="text-xs mt-1">Get started by creating a new event</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Current/Future Events */}
                                        <div className="divide-y divide-gray-200">
                                            {currentEvents.map((item) => (
                                            <div key={item.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                                                            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-semibold text-gray-900">{item.event_name}</h3>
                                                            <p className="text-xs text-gray-500 mt-1">{item.description || 'No description'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">Type:</span>
                                                        {getEventTypeBadge(item.event_type)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">Status:</span>
                                                        <div className="flex gap-1">
                                                            {getStatusBadge(item.is_active)}
                                                            {getArchiveBadge(item.is_archived)}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <FaClock className="w-3 h-3 text-gray-400" />
                                                            <span className="text-gray-600">Start: {formatDateWithTime(item.event_start)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaClock className="w-3 h-3 text-gray-400" />
                                                            <span className="text-gray-600">End: {formatDateWithTime(item.event_end)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => openAddJudges(item)}
                                                        className="flex-1 min-w-[120px] inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <RiAdminFill className="w-3 h-3 mr-1" />
                                                        Judges
                                                    </button>
                                                    <button
                                                        onClick={() => openEditEvent(item)}
                                                        className="flex-1 min-w-[100px] inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(item.id)}
                                                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Past Events Collapsible Section - Mobile */}
                                    {pastEvents.length > 0 && (
                                        <div className="border-t-4 border-gray-300 mt-4">
                                            <button
                                                onClick={() => setShowPastEvents(!showPastEvents)}
                                                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex items-center justify-between transition-colors"
                                            >
                                                <span className="text-sm font-semibold text-gray-700">
                                                    Past Events ({pastEvents.length})
                                                </span>
                                                {showPastEvents ? (
                                                    <FaChevronDown className="w-4 h-4 text-gray-600" />
                                                ) : (
                                                    <FaChevronRight className="w-4 h-4 text-gray-600" />
                                                )}
                                            </button>
                                            
                                            {showPastEvents && (
                                                <div className="divide-y divide-gray-200 bg-gray-50">
                                                    {pastEvents.map((item) => (
                                                        <div key={item.id} className="p-4 hover:bg-gray-100 opacity-75">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                                                                        <FaClock className="w-5 h-5 text-gray-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-sm font-semibold text-gray-700">{item.event_name}</h3>
                                                                        <p className="text-xs text-gray-500 mt-1">{item.description || 'No description'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-2 mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-gray-500">Type:</span>
                                                                    {getEventTypeBadge(item.event_type)}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-gray-500">Status:</span>
                                                                    <div className="flex gap-1">
                                                                        {getStatusBadge(item.is_active)}
                                                                        {getArchiveBadge(item.is_archived)}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <FaClock className="w-3 h-3 text-gray-400" />
                                                                        <span className="text-gray-600">Start: {formatDateWithTime(item.event_start)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <FaClock className="w-3 h-3 text-gray-400" />
                                                                        <span className="text-gray-600">End: {formatDateWithTime(item.event_end)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => openAddJudges(item)}
                                                                    className="flex-1 min-w-[120px] inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                                >
                                                                    <RiAdminFill className="w-3 h-3 mr-1" />
                                                                    Judges
                                                                </button>
                                                                <button
                                                                    onClick={() => openEditEvent(item)}
                                                                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                                                                >
                                                                    <FaEdit className="w-3 h-3 mr-1" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEvent(item.id)}
                                                                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                                                                >
                                                                    <FaTrash className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <table className="hidden md:table min-w-full divide-y divide-gray-200">
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
                                {currentEvents.length === 0 && pastEvents.length === 0 ? (
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
                                    <>
                                        {/* Current/Future Events */}
                                        {currentEvents.map((item) => (
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
                                                        onClick={() => openAddJudges(item)}
                                                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                    >
                                                        <RiAdminFill className="w-3 h-3 mr-1" />
                                                        Assign Judges
                                                    </button>
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
                                    ))}

                                    {/* Past Events Collapsible Section - Desktop */}
                                    {pastEvents.length > 0 && (
                                        <>
                                            <tr className="bg-gray-100 border-t-4 border-gray-300">
                                                <td colSpan="5" className="px-4 py-0">
                                                    <button
                                                        onClick={() => setShowPastEvents(!showPastEvents)}
                                                        className="w-full py-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
                                                    >
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            Past Events ({pastEvents.length})
                                                        </span>
                                                        {showPastEvents ? (
                                                            <FaChevronDown className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <FaChevronRight className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            
                                            {showPastEvents && pastEvents.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-100 bg-gray-50 opacity-75 transition-colors duration-150">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                                                                <FaClock className="w-4 h-4 text-gray-600" />
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-700">
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
                                                        <div className="text-sm text-gray-700 space-y-2">
                                                            <div className="flex items-start space-x-2">
                                                                <FaClock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <div className="font-medium text-gray-600">Start:</div>
                                                                    <div>{formatDateWithTime(item.event_start)}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-2">
                                                                <FaClock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <div className="font-medium text-gray-600">End:</div>
                                                                    <div>{formatDateWithTime(item.event_end)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            {getStatusBadge(item.is_active)}
                                                            {getArchiveBadge(item.is_archived)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => openAddJudges(item)}
                                                                className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
                                                            >
                                                                <RiAdminFill className="w-3 h-3 mr-1" />
                                                                Judges
                                                            </button>
                                                            <button
                                                                onClick={() => openEditEvent(item)}
                                                                className="inline-flex items-center px-2 py-1 border border-transparent rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
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
                                            ))}
                                        </>
                                    )}
                                </>
                                )}
                            </tbody>
                        </table>
                        </>
                    ) : (
                        // Criteria Table - Grouped by Event with Scrollable Content
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
                                <div className="max-h-[600px] overflow-y-auto">
                                    {eventsWithCriteria.map((event) => {
                                        const eventCriteria = criteriaByEvent[event.id] || [];
                                        const isExpanded = expandedEvents.has(event.id);
                                        
                                        return (
                                            <div key={event.id} className="border-b border-gray-200 last:border-b-0">
                                                {/* Event Header - Sticky */}
                                                <div 
                                                    className="sticky top-0 z-10 px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-150 shadow-sm"
                                                    onClick={() => toggleEventExpansion(event.id)}
                                                >
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                        <div className="flex items-center flex-1 min-w-0">
                                                            {isExpanded ? (
                                                                <FaChevronDown className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                                            ) : (
                                                                <FaChevronRight className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                                            )}
                                                            <div className="flex items-center min-w-0 flex-1">
                                                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                                                    <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div className="ml-3 min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                                        {event.event_name}
                                                                    </div>
                                                                    <div className="text-xs sm:text-sm text-gray-500">
                                                                        {event.event_type} • {eventCriteria.length} criteria
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                                            {getStatusBadge(event.is_active)}
                                                            {getArchiveBadge(event.is_archived)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Criteria Table for this Event */}
                                                {isExpanded && (
                                                    <div className="bg-gray-25">
                                                        {/* Mobile Card View */}
                                                        <div className="block lg:hidden divide-y divide-gray-200">
                                                            {eventCriteria.map((criteria) => (
                                                                <div key={criteria.id} className="p-4 hover:bg-gray-50">
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                                                                                <FaListAlt className="w-4 h-4 text-green-600" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="text-sm font-semibold text-gray-900 mb-1">{criteria.criteria_desc}</h4>
                                                                                <p className="text-xs text-gray-600">{criteria.definition || 'No description provided'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="space-y-2 mb-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500">Percentage:</span>
                                                                            {getPercentageDisplay(criteria.percentage)}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500">Round:</span>
                                                                            {getRoundBadge(criteria)}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-gray-500">Status:</span>
                                                                            {getStatusBadge(criteria.is_active)}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => openEditCriteria(criteria)}
                                                                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                                        >
                                                                            <FaEdit className="w-3 h-3 mr-1" />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteCriteria(criteria.id)}
                                                                            className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            <FaTrash className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Desktop Table View */}
                                                        <div className="hidden lg:block overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-100">
                                                                    <tr>
                                                                        <th scope="col" className="px-4 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Criteria
                                                                        </th>
                                                                        <th scope="col" className="px-4 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Description
                                                                        </th>
                                                                        <th scope="col" className="px-4 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Criteria %
                                                                        </th>
                                                                        <th scope="col" className="px-4 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Valid Round
                                                                        </th>
                                                                        <th scope="col" className="px-4 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Status
                                                                        </th>
                                                                        <th scope="col" className="px-4 sm:px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Actions
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {eventCriteria.map((criteria) => (
                                                                        <tr key={criteria.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                                            <td className="px-4 sm:px-6 py-3">
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
                                                                            <td className="px-4 sm:px-6 py-3">
                                                                                <div className="text-sm text-gray-600 max-w-xs">
                                                                                    {criteria.definition || 'No description provided'}
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-4 sm:px-6 py-3">
                                                                                {getPercentageDisplay(criteria.percentage)}
                                                                            </td>
                                                                            <td className="px-4 sm:px-6 py-3">
                                                                                {getRoundBadge(criteria)}
                                                                            </td>
                                                                            <td className="px-4 sm:px-6 py-3">
                                                                                {getStatusBadge(criteria.is_active)}
                                                                            </td>
                                                                            <td className="px-4 sm:px-6 py-3 text-right">
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
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {showAddJudgesModal && (
                        <AddMultipleJudgesModal 
                            show={showAddJudgesModal}
                            onClose={closeAddJudgesModal}
                            selectedEvent={selectedEventForJudges}
                        />
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
