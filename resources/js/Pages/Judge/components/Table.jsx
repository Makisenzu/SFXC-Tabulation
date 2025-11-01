import React, { useState, useEffect } from 'react';

const Table = ({ selectedContestant, onContestantSelect }) => {
    const [scores, setScores] = useState({});
    const [criteria, setCriteria] = useState([]);
    const [activeRound, setActiveRound] = useState(null);
    const [loading, setLoading] = useState(false);
    const [existingScores, setExistingScores] = useState([]);

    // Function to get photo URL
    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return '/default-candidate.jpg';
        
        if (photoPath.startsWith('http')) {
            return photoPath;
        }
        
        if (photoPath.startsWith('contestants/')) {
            return `/storage/${photoPath}`;
        }
        
        return `/storage/${photoPath}`;
    };

    // Fetch active round and criteria when a contestant is selected
    useEffect(() => {
        if (selectedContestant) {
            fetchActiveRoundAndCriteria(selectedContestant.event_id);
            fetchExistingScores(selectedContestant.id);
        }
    }, [selectedContestant]);

    // Fetch active round and criteria
    const fetchActiveRoundAndCriteria = async (eventId) => {
        setLoading(true);
        try {
            // Fetch active round
            const roundResponse = await fetch(`/getActiveRounds/${eventId}`);
            if (roundResponse.ok) {
                const rounds = await roundResponse.json();
                const activeRound = rounds.find(round => round.is_active);
                setActiveRound(activeRound);

                if (activeRound) {
                    // Fetch criteria for the active round
                    const criteriaResponse = await fetch(`/getCriteriaForRound/${activeRound.id}`);
                    if (criteriaResponse.ok) {
                        const criteriaData = await criteriaResponse.json();
                        setCriteria(criteriaData);
                        
                        // Initialize scores object
                        const initialScores = {};
                        criteriaData.forEach(criterion => {
                            initialScores[criterion.id] = '';
                        });
                        setScores(initialScores);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching round and criteria:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch existing scores for this contestant
    const fetchExistingScores = async (contestantId) => {
        try {
            const response = await fetch(`/getScoresForContestant/${contestantId}`);
            if (response.ok) {
                const scoresData = await response.json();
                setExistingScores(scoresData);
                
                // Pre-fill scores if they exist
                const filledScores = {};
                scoresData.forEach(score => {
                    filledScores[score.criteria_id] = score.score;
                });
                setScores(prev => ({ ...prev, ...filledScores }));
            }
        } catch (error) {
            console.error('Error fetching existing scores:', error);
        }
    };

    // Calculate percentage based on score and weight
    const calculatePercentage = (score, percentage) => {
        if (!score) return '0%';
        const weightValue = parseInt(percentage) / 100;
        const calculatedPercentage = (parseFloat(score) / 10) * weightValue * 100;
        return `${calculatedPercentage.toFixed(2)}%`;
    };

    // Handle score input change
    const handleScoreChange = (criteriaId, value) => {
        setScores(prev => ({
            ...prev,
            [criteriaId]: value
        }));
    };

    // Calculate total percentage
    const calculateTotalPercentage = () => {
        let total = 0;
        criteria.forEach(criterion => {
            const score = scores[criterion.id];
            if (score) {
                const weightValue = parseInt(criterion.percentage) / 100;
                total += (parseFloat(score) / 10) * weightValue * 100;
            }
        });
        return `${total.toFixed(2)}%`;
    };

    // Check if a score already exists for a criteria
    const getExistingScore = (criteriaId) => {
        return existingScores.find(score => score.criteria_id === criteriaId);
    };

    // Submit all scores
    const handleSubmitScores = async () => {
        if (!selectedContestant || !activeRound) return;

        try {
            // First, get the round_id for this contestant and active round
            const roundResponse = await fetch(`/getContestantRound/${selectedContestant.id}/${activeRound.id}`);
            if (!roundResponse.ok) {
                alert('Contestant is not registered for this round');
                return;
            }

            const roundData = await roundResponse.json();
            const roundId = roundData.id;

            // Prepare scores payload
            const scoresPayload = Object.entries(scores)
                .filter(([criteriaId, score]) => score !== '')
                .map(([criteriaId, score]) => ({
                    round_id: roundId,
                    criteria_id: parseInt(criteriaId),
                    score: parseFloat(score)
                }));

            if (scoresPayload.length === 0) {
                alert('Please enter at least one score');
                return;
            }

            // Submit scores
            const response = await fetch('/submitScores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ scores: scoresPayload })
            });

            if (response.ok) {
                alert('Scores submitted successfully!');
                // Refresh existing scores
                fetchExistingScores(selectedContestant.id);
            } else {
                alert('Failed to submit scores');
            }
        } catch (error) {
            console.error('Error submitting scores:', error);
            alert('Error submitting scores');
        }
    };

    // Reset scores
    const handleResetScores = () => {
        const resetScores = {};
        criteria.forEach(criterion => {
            resetScores[criterion.id] = '';
        });
        setScores(resetScores);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-800 mb-2">Beauty Pageant Judge Dashboard</h1>
                    <p className="text-gray-600">Official Scoring System</p>
                </div>

                {selectedContestant ? (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {/* Contestant Header */}
                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                            <div className="relative">
                                <img
                                    src={getPhotoUrl(selectedContestant.photo)}
                                    alt={selectedContestant.contestant_name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-xl"
                                    onError={(e) => {
                                        e.target.src = '/default-candidate.jpg';
                                    }}
                                />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                    <span className="text-sm font-bold text-white">
                                        {selectedContestant.sequence_no || selectedContestant.id}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-purple-800 mb-2">
                                    {selectedContestant.contestant_name}
                                </h2>
                                <p className="text-xl text-gray-600 mb-1">
                                    {selectedContestant.department || selectedContestant.cluster || 'Contestant'}
                                </p>
                                {selectedContestant.event && (
                                    <p className="text-lg text-gray-500">
                                        {selectedContestant.event.event_name}
                                    </p>
                                )}
                                {activeRound && (
                                    <p className="text-lg text-blue-600 font-semibold mt-2">
                                        Active Round: {activeRound.round_no}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-700 mb-1">
                                    {calculateTotalPercentage()}
                                </div>
                                <div className="text-sm text-gray-500">Current Score</div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Scoring Table */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">
                                        Scoring Table {activeRound && `- Round ${activeRound.round_no}`}
                                    </h3>
                                    
                                    {criteria.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                                            <div className="text-6xl mb-4">📋</div>
                                            <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                                No Criteria Available
                                            </h4>
                                            <p className="text-gray-600">
                                                Criteria have not been set up for this round yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border rounded-xl overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-purple-600 text-white">
                                                    <tr>
                                                        <th className="p-4 text-left font-semibold text-lg">Criteria</th>
                                                        <th className="p-4 text-left font-semibold text-lg">Definition</th>
                                                        <th className="p-4 text-center font-semibold text-lg">Weight</th>
                                                        <th className="p-4 text-center font-semibold text-lg">Score (0-10)</th>
                                                        <th className="p-4 text-center font-semibold text-lg">Percentage</th>
                                                        <th className="p-4 text-center font-semibold text-lg">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {criteria.map((criterion, index) => {
                                                        const currentScore = scores[criterion.id];
                                                        const percentage = calculatePercentage(currentScore, criterion.percentage);
                                                        const existingScore = getExistingScore(criterion.id);
                                                        
                                                        return (
                                                            <tr 
                                                                key={criterion.id} 
                                                                className="border-b hover:bg-gray-50"
                                                            >
                                                                <td className="p-4">
                                                                    <div className="font-medium text-lg text-purple-700">
                                                                        {criterion.criteria_desc}
                                                                    </div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="text-sm text-gray-600">
                                                                        {criterion.definition || 'No definition provided'}
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    <span className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-base font-medium">
                                                                        {criterion.percentage}%
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="10"
                                                                        step="0.1"
                                                                        value={currentScore}
                                                                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                                                                        className="w-24 p-3 border border-gray-300 rounded-lg text-center text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                                        placeholder="0.0"
                                                                        disabled={existingScore && existingScore.is_lock}
                                                                    />
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    <span className={`text-lg font-bold ${
                                                                        currentScore ? 'text-purple-700' : 'text-gray-400'
                                                                    }`}>
                                                                        {currentScore ? percentage : '-'}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-center">
                                                                    {existingScore ? (
                                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                                            existingScore.is_lock 
                                                                                ? 'bg-green-100 text-green-800' 
                                                                                : 'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                            {existingScore.is_lock ? 'Locked' : 'Submitted'}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                                                                            Not Scored
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                {/* Total Row */}
                                                <tfoot className="bg-gray-100">
                                                    <tr>
                                                        <td className="p-4 text-right font-bold text-lg" colSpan="4">
                                                            Total Score:
                                                        </td>
                                                        <td className="p-4 text-center" colSpan="2">
                                                            <span className="text-xl font-bold text-purple-700">
                                                                {calculateTotalPercentage()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleSubmitScores}
                                        className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-md"
                                    >
                                        Submit All Scores
                                    </button>
                                    <button 
                                        onClick={handleResetScores}
                                        className="flex-1 bg-gray-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors shadow-md"
                                    >
                                        Reset Scores
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <div className="text-8xl mb-6">👑</div>
                        <h3 className="text-3xl font-bold text-gray-700 mb-4">No Contestant Selected</h3>
                        <p className="text-xl text-gray-600 mb-6">
                            Please select a contestant from the sidebar to begin scoring
                        </p>
                        <div className="text-purple-600 text-lg">
                            ← Choose a contestant from the left panel
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500">
                    <p>Tabulation System v1.0</p>
                </div>
            </div>
        </div>
    );
};

export default Table;