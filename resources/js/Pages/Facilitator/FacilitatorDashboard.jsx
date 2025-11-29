import { Head } from '@inertiajs/react';
import FacilitatorLayout from '@/Layouts/FacilitatorLayout';
import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

export default function FacilitatorDashboard() {
    const [tallies, setTallies] = useState([]);
    const [selectedTally, setSelectedTally] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchTallies();
    }, []);

    const fetchTallies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/facilitator/medal-tallies');
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to fetch tallies');
            }
            
            const data = await response.json();
            console.log('Tallies data:', data);
            setTallies(data);
            if (data.length > 0) {
                setSelectedTally(data[0]);
            }
        } catch (error) {
            console.error('Error fetching tallies:', error);
            alert('Error loading medal tallies: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreUpdate = async (eventId, participantId, score) => {
        if (!selectedTally) return;
        
        setUpdating(true);
        try {
            const response = await fetch('/facilitator/update-medal-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    medal_tally_id: selectedTally.id,
                    event_id: eventId,
                    participant_id: participantId,
                    score: score,
                }),
            });

            if (response.ok) {
                await fetchTallies();
            }
        } catch (error) {
            console.error('Error updating score:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getScore = (eventId, participantId) => {
        if (!selectedTally) return 0;
        const score = selectedTally.scores?.find(
            s => s.event_id === eventId && s.participant_id === participantId
        );
        return score?.score || 0;
    };

    const getMedalButton = (currentScore, targetScore, eventId, participantId, color, label) => {
        const isActive = currentScore === targetScore;
        const baseClasses = "px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 disabled:opacity-50";
        const activeClasses = {
            'Gold': 'bg-yellow-500 text-white border-2 border-yellow-600 shadow-md',
            'Silver': 'bg-gray-400 text-white border-2 border-gray-500 shadow-md',
            'Bronze': 'bg-orange-600 text-white border-2 border-orange-700 shadow-md',
        };
        const inactiveClasses = {
            'Gold': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 hover:bg-yellow-200',
            'Silver': 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200',
            'Bronze': 'bg-orange-100 text-orange-800 border-2 border-orange-300 hover:bg-orange-200',
        };

        return (
            <button
                onClick={() => handleScoreUpdate(eventId, participantId, targetScore)}
                disabled={updating}
                className={`${baseClasses} ${isActive ? activeClasses[label] : inactiveClasses[label]}`}
            >
                {label}
            </button>
        );
    };

    const getParticipantColor = (participantName) => {
        const name = participantName.toUpperCase();
        if (name.includes('CBE')) {
            return 'border-l-4 border-yellow-500 bg-yellow-50';
        } else if (name.includes('CTE')) {
            return 'border-l-4 border-blue-500 bg-blue-50';
        } else if (name.includes('CCJE')) {
            return 'border-l-4 border-red-500 bg-red-50';
        }
        return 'border-l-4 border-gray-300 bg-white';
    };

    if (loading) {
        return (
            <FacilitatorLayout header="Medal Tally Scoring">
                <Head title="Medal Tally - Facilitator" />
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </FacilitatorLayout>
        );
    }

    return (
        <FacilitatorLayout header="Medal Tally Scoring">
            <Head title="Medal Tally - Facilitator" />

            <div className="space-y-4 sm:space-y-6">
                {/* Tally Selector */}
                {tallies.length > 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Medal Tally
                        </label>
                        <select
                            value={selectedTally?.id || ''}
                            onChange={(e) => setSelectedTally(tallies.find(t => t.id === parseInt(e.target.value)))}
                            className="block w-full sm:max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        >
                            {tallies.map(tally => (
                                <option key={tally.id} value={tally.id}>{tally.tally_title}</option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedTally && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center">
                                <FaTrophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 sm:mr-3" />
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedTally.tally_title}</h2>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        {selectedTally.events?.length || 0} Events • {selectedTally.participants?.length || 0} Participants
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile View - Stacked Cards */}
                        <div className="block lg:hidden p-4 space-y-4">
                            {selectedTally.events?.map(event => (
                                <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-900 text-sm">{event.event_name}</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {selectedTally.participants?.map(participant => {
                                            const currentScore = getScore(event.id, participant.id);
                                            return (
                                                <div key={participant.id} className={`rounded-lg p-4 border ${getParticipantColor(participant.participant_name)}`}>
                                                    <h4 className="font-medium text-gray-900 mb-3 text-sm">{participant.participant_name}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {getMedalButton(currentScore, 3, event.id, participant.id, 'yellow', 'Gold')}
                                                        {getMedalButton(currentScore, 2, event.id, participant.id, 'gray', 'Silver')}
                                                        {getMedalButton(currentScore, 1, event.id, participant.id, 'orange', 'Bronze')}
                                                        <button
                                                            onClick={() => handleScoreUpdate(event.id, participant.id, 0)}
                                                            disabled={updating}
                                                            className={`px-3 py-2 rounded-lg font-medium text-xs transition-all duration-150 ${
                                                                currentScore === 0
                                                                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                                                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event
                                        </th>
                                        {selectedTally.participants?.map(p => (
                                            <th key={p.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {p.participant_name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedTally.events?.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaMedal className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">{event.event_name}</span>
                                                </div>
                                            </td>
                                            {selectedTally.participants?.map(participant => {
                                                const currentScore = getScore(event.id, participant.id);
                                                return (
                                                    <td key={participant.id} className="px-6 py-4">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="flex gap-1">
                                                                {getMedalButton(currentScore, 3, event.id, participant.id, 'yellow', 'Gold')}
                                                                {getMedalButton(currentScore, 2, event.id, participant.id, 'gray', 'Silver')}
                                                                {getMedalButton(currentScore, 1, event.id, participant.id, 'orange', 'Bronze')}
                                                            </div>
                                                            {currentScore > 0 && (
                                                                <button
                                                                    onClick={() => handleScoreUpdate(event.id, participant.id, 0)}
                                                                    disabled={updating}
                                                                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                                                                >
                                                                    Clear
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tallies.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                        <FaTrophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm sm:text-base">No medal tallies available</p>
                    </div>
                )}
            </div>
        </FacilitatorLayout>
    );
}
