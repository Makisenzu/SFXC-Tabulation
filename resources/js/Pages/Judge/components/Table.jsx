import React, { useState, useEffect } from 'react';

const Table = ({ selectedContestant }) => {
    const [scores, setScores] = useState({});
    const [criteria, setCriteria] = useState([]);
    const [activeRound, setActiveRound] = useState(null);
    const [loading, setLoading] = useState(false);
    const [existingScores, setExistingScores] = useState([]);

    // Function to get photo URL
    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return '/default-candidate.jpg';
        if (photoPath.startsWith('http')) return photoPath;
        if (photoPath.startsWith('contestants/')) return `/storage/${photoPath}`;
        return `/storage/${photoPath}`;
    };

    // Extract criteria from selected contestant
    useEffect(() => {
        if (selectedContestant) {
            console.log('🟡 Selected Contestant:', selectedContestant);
            
            // Set loading state
            setLoading(true);
            
            // Extract criteria from contestant data
            if (selectedContestant.criteria && selectedContestant.criteria.length > 0) {
                console.log('🟡 Criteria found in contestant:', selectedContestant.criteria);
                setCriteria(selectedContestant.criteria);
                
                // Initialize scores from existing criteria data
                const initialScores = {};
                selectedContestant.criteria.forEach(criterion => {
                    initialScores[criterion.id] = criterion.score || '';
                });
                setScores(initialScores);
            } else {
                console.log('🔴 No criteria found in contestant data');
                setCriteria([]);
            }
            
            // Set active round info if available
            if (selectedContestant.round_id) {
                setActiveRound({
                    id: selectedContestant.round_id,
                    round_no: selectedContestant.round_number || 1
                });
            }
            
            setLoading(false);
        } else {
            // Reset when no contestant is selected
            setCriteria([]);
            setScores({});
            setActiveRound(null);
        }
    }, [selectedContestant]);

    // Handle score input change
    const handleScoreChange = (criteriaId, value) => {
        // Allow empty, numbers, and decimals with up to 2 decimal places
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            const numValue = parseFloat(value);
            // Only set if value is between 0 and 10 or empty
            if (value === '' || (numValue >= 0 && numValue <= 10)) {
                setScores(prev => ({
                    ...prev,
                    [criteriaId]: value
                }));
            }
        }
    };

    // Handle score input blur - format the value
    const handleScoreBlur = (criteriaId, value) => {
        if (value && value !== '') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                // Ensure value is between 0 and 10 and format to 2 decimal places
                const clampedValue = Math.min(10, Math.max(0, numValue));
                setScores(prev => ({
                    ...prev,
                    [criteriaId]: clampedValue.toFixed(2)
                }));
            }
        } else {
            // If empty, set to empty string
            setScores(prev => ({
                ...prev,
                [criteriaId]: ''
            }));
        }
    };

    // Calculate percentage based on score and weight
    const calculatePercentage = (score, percentage) => {
        if (!score || score === '') return '0.00';
        const weightValue = parseInt(percentage) / 100;
        const calculatedPercentage = (parseFloat(score) / 10) * weightValue * 100;
        return calculatedPercentage.toFixed(2);
    };

    // Calculate total percentage
    const calculateTotalPercentage = () => {
        let total = 0;
        criteria.forEach(criterion => {
            const score = scores[criterion.id];
            if (score && score !== '') {
                const weightValue = parseInt(criterion.percentage) / 100;
                total += (parseFloat(score) / 10) * weightValue * 100;
            }
        });
        return total.toFixed(2);
    };

    // Calculate total score
    const calculateTotalScore = () => {
        let total = 0;
        criteria.forEach(criterion => {
            const score = scores[criterion.id];
            if (score && score !== '') {
                total += parseFloat(score);
            }
        });
        return total.toFixed(2);
    };

    return (
        <div className="h-full w-full bg-gray-50">
            {selectedContestant ? (
                <div className="h-full w-full bg-white">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
                        </div>
                    ) : (
                        /* Full Space Table Layout */
                        <div className="h-full w-full overflow-auto">
                            <table className="w-full h-full border-collapse text-2xl">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-center p-8 border-2 border-gray-400" style={{ width: '30%' }}>CONTESTANT</th>
                                        <th className="text-center p-8 border-2 border-gray-400" style={{ width: '35%' }}>CRITERIA</th>
                                        <th className="text-center p-8 border-2 border-gray-400" style={{ width: '15%' }}>SCORE (0-10)</th>
                                        <th className="text-center p-8 border-2 border-gray-400" style={{ width: '20%' }}>% EQUIVALENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {criteria.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-16 text-gray-500 text-2xl border-2 border-gray-400 h-full">
                                                No criteria available for this contestant.
                                            </td>
                                        </tr>
                                    ) : (
                                        criteria.map((criterion, index) => {
                                            const currentScore = scores[criterion.id];
                                            const percentage = calculatePercentage(currentScore, criterion.percentage);
                                            
                                            return (
                                                <tr key={criterion.id} className="hover:bg-gray-50">
                                                    {/* Photo column - only show in first row */}
                                                    {index === 0 && (
                                                        <td 
                                                            className="text-center p-8 align-middle border-2 border-gray-400" 
                                                            rowSpan={criteria.length}
                                                            style={{ verticalAlign: 'middle', height: '100%' }}
                                                        >
                                                            <div className="flex flex-col items-center justify-center h-full">
                                                                <img
                                                                    src={getPhotoUrl(selectedContestant.photo)}
                                                                    alt={selectedContestant.contestant_name}
                                                                    className="w-72 h-96 object-cover border-4 border-blue-300 shadow-2xl rounded-2xl mb-6"
                                                                    onError={(e) => {
                                                                        e.target.src = '/default-candidate.jpg';
                                                                    }}
                                                                />
                                                                <div className="text-2xl text-gray-800 font-bold mt-4">
                                                                    {selectedContestant.contestant_name}
                                                                </div>
                                                                {/* <div className="text-xl text-gray-600 mt-2">
                                                                    {selectedContestant.cluster || 'Contestant'}
                                                                </div> */}
                                                                {/* {activeRound && (
                                                                    <div className="text-lg text-blue-600 font-semibold mt-2">
                                                                        Round {activeRound.round_no}
                                                                    </div>
                                                                )}
                                                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                                    <div className="text-3xl font-bold text-blue-600">
                                                                        {calculateTotalPercentage()}%
                                                                    </div>
                                                                    <div className="text-lg text-gray-600">Total Percentage</div>
                                                                    <div className="text-xl font-bold text-gray-800 mt-2">
                                                                        Score: {calculateTotalScore()}
                                                                    </div>
                                                                </div> */}
                                                            </div>
                                                        </td>
                                                    )}
                                                    
                                                    {/* Criteria column */}
                                                    <td className="p-8 align-middle border-2 border-gray-400">
                                                        <div className="font-bold text-gray-800 text-3xl mb-4">
                                                            {criterion.criteria_desc}
                                                        </div>
                                                        {criterion.definition && (
                                                            <div className="text-xl text-gray-600 mt-3">
                                                                {criterion.definition}
                                                            </div>
                                                        )}
                                                        <div className="text-xl text-gray-500 mt-4 font-semibold">
                                                            Percentage: {criterion.percentage}%
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Score column - Now with input field that accepts decimals */}
                                                    <td className="text-center p-8 align-middle border-2 border-gray-400">
                                                        <div className="flex justify-center">
                                                            <input
                                                                type="text"
                                                                value={currentScore || ''}
                                                                onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                                                                onBlur={(e) => handleScoreBlur(criterion.id, e.target.value)}
                                                                className="w-40 text-4xl font-bold text-gray-800 text-center border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                                                                placeholder="0.00"
                                                                maxLength={5}
                                                            />
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-2">
                                                            Enter 0-10 (decimals allowed)
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Percentage column */}
                                                    <td className="text-center p-8 align-middle border-2 border-gray-400">
                                                        <span className="text-4xl font-bold text-blue-600">
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-white">
                    <div className="text-center">
                        <div className="text-9xl mb-10">👑</div>
                        <h3 className="text-4xl font-bold text-gray-700 mb-8">No Contestant Selected</h3>
                        <p className="text-2xl text-gray-600">
                            Please select a contestant from the sidebar to view scoring details
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;