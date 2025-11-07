import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import appLogo from '@/images/logo.png';
import axios from 'axios';

// Memoized Contestant Info Component
const ContestantInfo = React.memo(({ photo, name, getPhotoUrl }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <img
                src={getPhotoUrl(photo)}
                alt={name}
                className="w-72 h-96 object-cover border-4 border-blue-300 shadow-2xl rounded-2xl mb-6"
                loading="eager"
                decoding="async"
                onError={(e) => {
                    e.target.src = '/default-candidate.jpg';
                }}
            />
            <div className="text-2xl text-gray-800 font-bold mt-4">
                {name}
            </div>
        </div>
    );
});


const Table = ({ selectedContestant }) => {
    const [scores, setScores] = useState({});
    const [criteria, setCriteria] = useState([]);
    const [activeRound, setActiveRound] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const lastSavedScores = useRef({});
    const timeoutRef = useRef(null);

    // Function to get photo URL with memoization
    const getPhotoUrl = useCallback((photoPath) => {
        if (!photoPath) return '/default-candidate.jpg';
        if (photoPath.startsWith('http')) return photoPath;
        if (photoPath.startsWith('contestants/')) return `/storage/${photoPath}`;
        return `/storage/${photoPath}`;
    }, []);

    // Preload image when contestant changes
    useEffect(() => {
        if (selectedContestant?.photo) {
            const img = new Image();
            img.src = getPhotoUrl(selectedContestant.photo);
        }
    }, [selectedContestant?.photo, getPhotoUrl]);

    // Update score in database using Inertia
    const updateScoreInDatabase = useCallback(async (criteriaId, score, tabulationId) => {
        try {
            setSaving(true);
            console.log('🟡 Updating score:', { criteriaId, score, tabulationId });

            await axios.patch('/judge/update-score', {
                criteria_id: criteriaId,
                score: score === '' ? 0 : parseFloat(score),
                tabulation_id: tabulationId,
                contestant_id: selectedContestant?.id,
                round_id: selectedContestant?.round_id
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    console.log('🟢 Score updated successfully');
                    lastSavedScores.current[criteriaId] = score;
                },
                onError: (errors) => {
                    console.error('🔴 Error updating score:', errors);
                    throw new Error(errors.message || 'Failed to update score');
                }
            });

        } catch (error) {
            console.error('🔴 Error updating score:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    }, [selectedContestant]);

    // Auto-save score when user moves to another field
    const autoSaveScore = useCallback((criteriaId, score, tabulationId) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const previousScore = lastSavedScores.current[criteriaId];
        if (previousScore === score) {
            console.log('🟡 Score unchanged, skipping save');
            return;
        }

        timeoutRef.current = setTimeout(() => {
            updateScoreInDatabase(criteriaId, score, tabulationId);
        }, 500);
    }, [updateScoreInDatabase]);

    // Extract criteria from selected contestant
    useEffect(() => {
        if (selectedContestant) {
            console.log('🟡 Selected Contestant:', selectedContestant);
            
            // Use setTimeout to defer rendering and prevent blocking
            const timer = setTimeout(() => {
                if (selectedContestant.criteria && selectedContestant.criteria.length > 0) {
                    console.log('🟡 Criteria found in contestant:', selectedContestant.criteria);
                    setCriteria(selectedContestant.criteria);
                    
                    const initialScores = {};
                    selectedContestant.criteria.forEach(criterion => {
                        const score = criterion.score || '';
                        initialScores[criterion.id] = score;
                        lastSavedScores.current[criterion.id] = score;
                    });
                    setScores(initialScores);
                } else {
                    console.log('🔴 No criteria found in contestant data');
                    setCriteria([]);
                }
                
                if (selectedContestant.round_id) {
                    setActiveRound({
                        id: selectedContestant.round_id,
                        round_number: selectedContestant.round_number || 1
                    });
                }
                
                setLoading(false);
            }, 0);

            return () => clearTimeout(timer);
        } else {
            setCriteria([]);
            setScores({});
            setActiveRound(null);
            lastSavedScores.current = {};
        }
    }, [selectedContestant?.id]); // Only depend on contestant ID, not entire object

    // Handle score input change - optimized with debounce
    const handleScoreChange = useCallback((criteriaId, value, tabulationId) => {
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            const numValue = parseFloat(value);
            if (value === '' || (numValue >= 0 && numValue <= 10)) {
                setScores(prev => ({
                    ...prev,
                    [criteriaId]: value
                }));

                autoSaveScore(criteriaId, value, tabulationId);
            }
        }
    }, [autoSaveScore]);

    // Handle score input blur - format the value and force immediate save
    const handleScoreBlur = useCallback(async (criteriaId, value, tabulationId) => {
        let finalValue = value;
        
        if (value && value !== '') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                const clampedValue = Math.min(10, Math.max(0, numValue));
                finalValue = clampedValue.toFixed(2);
                
                setScores(prev => ({
                    ...prev,
                    [criteriaId]: finalValue
                }));
            }
        } else {
            finalValue = '';
            setScores(prev => ({
                ...prev,
                [criteriaId]: finalValue
            }));
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (lastSavedScores.current[criteriaId] !== finalValue) {
            await updateScoreInDatabase(criteriaId, finalValue, tabulationId);
        }
    }, [updateScoreInDatabase]);

    // Handle contestant change - save all pending scores
    useEffect(() => {
        const savePendingScores = async () => {
            if (!criteria || criteria.length === 0) return;
            
            const pendingSaves = [];
            
            criteria.forEach(criterion => {
                const currentScore = scores[criterion.id];
                const lastSavedScore = lastSavedScores.current[criterion.id];
                
                if (currentScore !== undefined && currentScore !== lastSavedScore) {
                    pendingSaves.push(
                        updateScoreInDatabase(criterion.id, currentScore, criterion.tabulation_id)
                    );
                }
            });

            if (pendingSaves.length > 0) {
                console.log('🟡 Saving pending scores before contestant change');
                try {
                    await Promise.all(pendingSaves);
                } catch (error) {
                    console.error('🔴 Error saving pending scores:', error);
                }
            }
        };

        if (selectedContestant && criteria.length > 0) {
            savePendingScores();
        }
    }, [selectedContestant, criteria, scores, updateScoreInDatabase]);

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
                                                    {index === 0 && (
                                                        <td 
                                                            className="text-center p-8 align-middle border-2 border-gray-400" 
                                                            rowSpan={criteria.length}
                                                            style={{ verticalAlign: 'middle', height: '100%' }}
                                                        >
                                                            <ContestantInfo 
                                                                photo={selectedContestant.photo}
                                                                name={selectedContestant.contestant_name}
                                                                getPhotoUrl={getPhotoUrl}
                                                            />
                                                        </td>
                                                    )}
                                                    
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
                                                    
                                                    <td className="text-center p-8 align-middle border-2 border-gray-400">
                                                        <div className="flex justify-center">
                                                            <input
                                                                type="text"
                                                                value={currentScore || ''}
                                                                onChange={(e) => handleScoreChange(criterion.id, e.target.value, criterion.tabulation_id)}
                                                                onBlur={(e) => handleScoreBlur(criterion.id, e.target.value, criterion.tabulation_id)}
                                                                className="w-40 text-4xl font-bold text-gray-800 text-center border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                                                                placeholder="0.00"
                                                                maxLength={5}
                                                            />
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-2">
                                                            Enter 0-10 (decimals allowed)
                                                        </div>
                                                    </td>
                                                    
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
                <div className="flex flex-col items-center text-center">
                    <img
                        src={appLogo}
                        alt="App Logo"
                        className="h-26 w-auto mb-10"
                    />
                    <h3 className="text-4xl font-bold text-gray-700 mb-8">
                        No Contestant Selected
                    </h3>
                    <p className="text-2xl text-gray-600">
                        Select a contestant to view scoring details
                    </p>
                </div>
            </div>
                        )}
                    </div>
                );
            };

export default Table;