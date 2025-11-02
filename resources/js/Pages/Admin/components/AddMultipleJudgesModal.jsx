import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { RiAdminFill } from "react-icons/ri";
import { showAlert } from '@/Sweetalert';

export default function AddMultipleJudgesModal({ show, onClose, selectedEvent }) {
    const [selectedJudges, setSelectedJudges] = useState(new Set());
    const [judges, setJudges] = useState([]);
    const [loadingJudges, setLoadingJudges] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (show && selectedEvent) {
            fetchJudges();
        }
    }, [show, selectedEvent]);

    const fetchJudges = async () => {
        setLoadingJudges(true);
        try {
            const response = await fetch('/getJudges');
            if (response.ok) {
                const data = await response.json();
                setJudges(data.judges || []);
            }
        } catch (error) {
            console.error('Error fetching judges:', error);
            showAlert('error', 'Failed to load judges');
        } finally {
            setLoadingJudges(false);
        }
    };

    const handleJudgeToggle = (judgeId) => {
        const newSelected = new Set(selectedJudges);
        if (newSelected.has(judgeId)) {
            newSelected.delete(judgeId);
        } else {
            newSelected.add(judgeId);
        }
        setSelectedJudges(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedJudges.size === judges.length) {
            setSelectedJudges(new Set());
        } else {
            setSelectedJudges(new Set(judges.map(judge => judge.id)));
        }
    };

    const handleSubmit = () => {
        if (selectedJudges.size === 0) {
            showAlert('error', 'Please select at least one judge');
            return;
        }

        if (!selectedEvent) {
            showAlert('error', 'No event selected');
            return;
        }

        setProcessing(true);
        
        const payload = {
            event_id: selectedEvent.id,
            user_id: Array.from(selectedJudges)
        };
        
        router.post('/assign-judge', payload, {
            onSuccess: () => {
                showAlert('success', `${selectedJudges.size} judge(s) assigned successfully!`);
                handleClose();
            },
            onError: (errors) => {
                showAlert('error', 'Failed to assign judges');
                console.error('Error assigning judges:', errors);
            },
            onFinish: () => setProcessing(false)
        });
    };

    const handleClose = () => {
        onClose();
        setSelectedJudges(new Set());
        setSearchQuery('');
    };

    const filteredJudges = judges.filter(judge =>
        judge.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!show || !selectedEvent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl p-6 mx-auto">
                <div className="relative bg-white rounded-2xl shadow-2xl">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <RiAdminFill className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Assign Judges to Event
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedEvent.event_name}
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
                        {/* Search Bar */}
                        {judges.length > 0 && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search judges..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                                />
                                <RiAdminFill className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        )}

                        {/* Judges Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Select Judges
                                </label>
                                {judges.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        {selectedJudges.size === judges.length 
                                            ? 'Deselect All' 
                                            : 'Select All'}
                                    </button>
                                )}
                            </div>
                            
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="max-h-96 overflow-y-auto">
                                    {loadingJudges ? (
                                        <div className="p-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="text-gray-500 mt-2">Loading judges...</p>
                                        </div>
                                    ) : filteredJudges.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                {searchQuery ? (
                                                    <AlertCircle className="h-8 w-8 text-gray-400" />
                                                ) : (
                                                    <RiAdminFill className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            <p className="text-gray-500 font-medium">
                                                {searchQuery 
                                                    ? 'No judges match your search'
                                                    : 'No judges available'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {filteredJudges.map(judge => (
                                                <label 
                                                    key={judge.id}
                                                    className="flex items-center px-5 py-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedJudges.has(judge.id)}
                                                        onChange={() => handleJudgeToggle(judge.id)}
                                                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                                    />
                                                    <span className="ml-4 text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                        {judge.username}
                                                    </span>
                                                    <span className="ml-auto text-xs text-gray-500 font-normal">
                                                        ID: {judge.id}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {selectedJudges.size > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                                        {selectedJudges.size} Selected
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
                            disabled={processing || selectedJudges.size === 0}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <RiAdminFill className="w-4 h-4"/>
                            {processing ? 'Assigning...' : `Assign ${selectedJudges.size} Judge${selectedJudges.size !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}