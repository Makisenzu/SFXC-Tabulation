import React, { useState, useEffect } from 'react';
import { 
    Trophy,
    Medal,
    Award,
    Filter,
    RefreshCw,
    Printer,
    FileDown,
    FileSpreadsheet,
    X
} from 'lucide-react';
import appLogo from '@/images/printLogo.jpg';

const ScoreTables = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [contestants, setContestants] = useState([]);
    const [judges, setJudges] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [generalData, setGeneralData] = useState([]);

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // Fetch rounds when event is selected
    useEffect(() => {
        if (selectedEvent) {
            fetchRounds(selectedEvent);
        }
    }, [selectedEvent]);

    // Fetch data when round is selected
    useEffect(() => {
        if (selectedRound) {
            fetchRoundData(selectedEvent, selectedRound);
        }
    }, [selectedRound]);

    // Setup real-time listener for score updates
    useEffect(() => {
        console.log('🔍 Broadcasting setup check:', {
            selectedEvent,
            selectedRound,
            hasEcho: !!window.Echo,
            echoType: window.Echo?.constructor?.name
        });

        if (selectedEvent && selectedRound && window.Echo) {
            const channelName = `score-updates.${selectedEvent}.${selectedRound}`;
            
            console.log('🟡 Attempting to subscribe to:', channelName);

            try {
                const channel = window.Echo.private(channelName)
                    .listen('.score.updated', (event) => {
                        console.log('🟢 Score update received:', event);
                        
                        // Update the specific score in the scores array
                        if (event.score) {
                            updateSingleScore(event.score);
                        }
                    });

                console.log('✅ Successfully subscribed to channel:', channelName);

                // Cleanup on unmount or when event/round changes
                return () => {
                    console.log('🔴 Leaving channel:', channelName);
                    window.Echo.leave(channelName);
                };
            } catch (error) {
                console.error('❌ Failed to subscribe to channel:', error);
            }
        } else {
            console.warn('⚠️ Cannot subscribe - missing:', {
                selectedEvent: !!selectedEvent,
                selectedRound: !!selectedRound,
                windowEcho: !!window.Echo
            });
        }
    }, [selectedEvent, selectedRound]);

    // Update a single score in the state
    const updateSingleScore = (scoreData) => {
        setScores(prevScores => {
            const updatedScores = [...prevScores];
            
            // Find existing score index
            const existingIndex = updatedScores.findIndex(
                s => s.judge_id === scoreData.judge_id && 
                     s.contestant_id === scoreData.contestant_id && 
                     s.criteria_id === scoreData.criteria_id
            );

            const newScore = {
                id: scoreData.tabulation_id,
                judge_id: scoreData.judge_id,
                contestant_id: scoreData.contestant_id,
                criteria_id: scoreData.criteria_id,
                score: scoreData.score,
                is_lock: scoreData.is_lock
            };

            if (existingIndex >= 0) {
                // Update existing score
                updatedScores[existingIndex] = newScore;
            } else {
                // Add new score
                updatedScores.push(newScore);
            }

            console.log('✅ Score updated in state:', newScore);
            return updatedScores;
        });
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/getEvents');
            const data = await response.json();
            const processedEvents = Array.isArray(data) ? data : data?.events || data?.data || [];
            setEvents(processedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRounds = async (eventId) => {
        try {
            setLoading(true);
            const response = await fetch(`/getActiveRounds/${eventId}`);
            const data = await response.json();
            const roundsData = Array.isArray(data) ? data : [];
            setRounds(roundsData);
            
            // Prioritize active round if it exists
            if (roundsData.length > 0) {
                const activeRound = roundsData.find(round => round.is_active === 1 || round.is_active === true);
                if (activeRound) {
                    setSelectedRound(activeRound.round_no);
                } else {
                    // If no active round, select the first one
                    setSelectedRound(roundsData[0].round_no);
                }
            }
        } catch (error) {
            console.error('Error fetching rounds:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoundData = async (eventId, roundNo) => {
        try {
            setLoading(true);
            
            // Fetch contestants for the round
            const contestantsResponse = await fetch(`/get-round-contestants/${eventId}/${roundNo}`);
            const contestantsData = await contestantsResponse.json();
            setContestants(Array.isArray(contestantsData) ? contestantsData : []);

            // Fetch judges for the event
            const judgesResponse = await fetch(`/getJudgesByEvent/${eventId}`);
            const judgesData = await judgesResponse.json();
            setJudges(Array.isArray(judgesData) ? judgesData : judgesData?.judges || []);

            // Fetch criteria for the round
            const criteriaResponse = await fetch(`/getCriteriaByRound/${eventId}/${roundNo}`);
            const criteriaData = await criteriaResponse.json();
            setCriteria(Array.isArray(criteriaData) ? criteriaData : []);

            // Fetch all scores for the round
            const scoresResponse = await fetch(`/getScoresByRound/${eventId}/${roundNo}`);
            const scoresData = await scoresResponse.json();
            setScores(Array.isArray(scoresData) ? scoresData : []);

        } catch (error) {
            console.error('Error fetching round data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get score for specific judge, contestant, and criteria
    const getScore = (judgeId, contestantId, criteriaId) => {
        const score = scores.find(
            s => s.judge_id === judgeId && 
                 s.contestant_id === contestantId && 
                 s.criteria_id === criteriaId
        );
        return score ? parseFloat(score.score || 0).toFixed(2) : '0.00';
    };

    // Calculate total score for a contestant by a judge
    const calculateTotalScore = (judgeId, contestantId) => {
        let total = 0;
        criteria.forEach(criterion => {
            const score = scores.find(
                s => s.judge_id === judgeId && 
                     s.contestant_id === contestantId && 
                     s.criteria_id === criterion.id
            );
            if (score) {
                total += parseFloat(score.score || 0);
            }
        });
        return total.toFixed(2);
    };

    // Calculate weighted percentage for a contestant by a judge
    const calculateWeightedPercentage = (judgeId, contestantId) => {
        let totalPercentage = 0;
        criteria.forEach(criterion => {
            const score = scores.find(
                s => s.judge_id === judgeId && 
                     s.contestant_id === contestantId && 
                     s.criteria_id === criterion.id
            );
            if (score) {
                const weightValue = parseInt(criterion.percentage) / 100;
                totalPercentage += (parseFloat(score.score || 0) / 10) * weightValue * 100;
            }
        });
        return totalPercentage.toFixed(2);
    };

    // Get ranking for each judge's scored contestants
    const getJudgeRankings = (judgeId) => {
        const contestantScores = contestants.map(contestant => ({
            id: contestant.id,
            name: contestant.contestant_name,
            sequence_no: contestant.sequence_no,
            totalScore: parseFloat(calculateTotalScore(judgeId, contestant.id)),
            percentage: parseFloat(calculateWeightedPercentage(judgeId, contestant.id))
        }));

        // Create a copy for ranking calculation (sort by percentage)
        const sortedForRanking = [...contestantScores].sort((a, b) => b.percentage - a.percentage);

        // Assign ranks based on percentage
        let rank = 1;
        let previousPercentage = null;
        let sameRankCount = 0;

        sortedForRanking.forEach((contestant, index) => {
            if (previousPercentage !== null && contestant.percentage < previousPercentage) {
                rank += sameRankCount;
                sameRankCount = 1;
            } else if (previousPercentage === contestant.percentage) {
                sameRankCount++;
            } else {
                sameRankCount = 1;
            }
            
            previousPercentage = contestant.percentage;
            contestant.rank = rank;
        });

        // Create a rank map
        const rankMap = {};
        sortedForRanking.forEach(contestant => {
            rankMap[contestant.id] = contestant.rank;
        });

        // Return contestants sorted by sequence number with their ranks
        return contestantScores
            .map(contestant => ({
                ...contestant,
                rank: rankMap[contestant.id]
            }))
            .sort((a, b) => a.sequence_no - b.sequence_no);
    };

    // Get rank badge color
    const getRankBadgeColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-red-500 text-white';
            case 2:
                return 'bg-green-500 text-white';
            case 3:
                return 'bg-blue-500 text-white';
            case 4:
                return 'bg-sky-400 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    };

    // Print General Tabulated Result
    const printGeneralTabulation = () => {
        // Debug: Check data availability
        console.log('Print Debug:', {
            contestants: contestants.length,
            judges: judges.length,
            criteria: criteria.length,
            scores: scores.length,
            contestantsData: contestants
        });

        if (contestants.length === 0) {
            alert('No contestants data available. Please select an event and round first.');
            return;
        }

        if (judges.length === 0) {
            alert('No judges data available. Please ensure judges are assigned to this event.');
            return;
        }

        // Calculate general tabulation data
        const data = contestants.map(contestant => {
            console.log('Processing contestant:', contestant);
            
            const judgeData = judges.map(judge => {
                const judgeScores = scores.filter(
                    s => s.judge_id === judge.id && s.contestant_id === contestant.id
                );

                // Calculate percentage for this judge
                let totalPercentage = 0;
                criteria.forEach(criterion => {
                    const score = judgeScores.find(s => s.criteria_id === criterion.id);
                    if (score && score.score) {
                        const weightValue = parseInt(criterion.percentage) / 100;
                        totalPercentage += (parseFloat(score.score) / 10) * weightValue * 100;
                    }
                });

                return {
                    judgeId: judge.id,
                    judgeName: judge.name,
                    percentage: totalPercentage
                };
            });

            // Calculate average percentage across all judges
            const avgPercentage = judgeData.length > 0
                ? judgeData.reduce((sum, j) => sum + j.percentage, 0) / judgeData.length
                : 0;

            return {
                id: contestant.id,
                sequence_no: contestant.sequence_no || 0,
                name: contestant.contestant_name || contestant.name || 'Unknown',
                judgeData,
                avgPercentage
            };
        });

        console.log('General Data:', data);

        // Calculate ranks for each judge
        judges.forEach(judge => {
            const sortedByJudge = [...data].sort((a, b) => {
                const aPercentage = a.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                const bPercentage = b.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                return bPercentage - aPercentage;
            });

            let rank = 1;
            let previousPercentage = null;
            let sameRankCount = 0;

            sortedByJudge.forEach((contestant, index) => {
                const judgePercentage = contestant.judgeData.find(j => j.judgeId === judge.id)?.percentage || 0;
                
                if (previousPercentage !== null && judgePercentage < previousPercentage) {
                    rank += sameRankCount;
                    sameRankCount = 1;
                } else if (previousPercentage === judgePercentage) {
                    sameRankCount++;
                } else {
                    sameRankCount = 1;
                }
                
                previousPercentage = judgePercentage;
                
                const judgeDataItem = contestant.judgeData.find(j => j.judgeId === judge.id);
                if (judgeDataItem) {
                    judgeDataItem.rank = rank;
                }
            });
        });

        // Calculate overall ranks based on average percentage
        const sortedByAvg = [...data].sort((a, b) => b.avgPercentage - a.avgPercentage);
        
        let rank = 1;
        let previousPercentage = null;
        let sameRankCount = 0;

        sortedByAvg.forEach((contestant, index) => {
            if (previousPercentage !== null && contestant.avgPercentage < previousPercentage) {
                rank += sameRankCount;
                sameRankCount = 1;
            } else if (previousPercentage === contestant.avgPercentage) {
                sameRankCount++;
            } else {
                sameRankCount = 1;
            }
            
            previousPercentage = contestant.avgPercentage;
            contestant.overallRank = rank;
        });

        // Sort by overall rank for display
        data.sort((a, b) => a.overallRank - b.overallRank);

        // Set data and show modal
        setGeneralData(data);
        setShowPrintModal(true);
    };

    // Export functions
    const exportToCSV = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;
        
        let csv = `General Tabulated Result\n\n`;
        
        // Headers
        csv += 'NO,CONTESTANT,';
        judges.forEach(judge => {
            csv += `${judge.name} % SCORE,${judge.name} RANK,`;
        });
        csv += 'AVG PERCENTAGE,RANK\n';
        
        // Data rows
        generalData.forEach((contestant, index) => {
            csv += `${index + 1},${contestant.name},`;
            contestant.judgeData.forEach(judge => {
                csv += `${judge.percentage.toFixed(2)}%,${judge.rank},`;
            });
            csv += `${contestant.avgPercentage.toFixed(2)}%,${contestant.overallRank}\n`;
        });
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `General_Tabulated_Result.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToExcel = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;
        
        let html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>General Results</x:Name>
                                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
            </head>
            <body>
                <table>
                    <tr><td colspan="${2 + (judges.length * 2) + 2}"><b>General Tabulated Result</b></td></tr>
                    <tr></tr>
                    <tr>
                        <th>NO</th>
                        <th>CONTESTANT</th>
                        ${judges.map(judge => `<th>${judge.name} % SCORE</th><th>${judge.name} RANK</th>`).join('')}
                        <th>AVG PERCENTAGE</th>
                        <th>RANK</th>
                    </tr>
                    ${generalData.map((contestant, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${contestant.name}</td>
                            ${contestant.judgeData.map(judge => `<td>${judge.percentage.toFixed(2)}%</td><td>${judge.rank}</td>`).join('')}
                            <td>${contestant.avgPercentage.toFixed(2)}%</td>
                            <td>${contestant.overallRank}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;
        
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `General_Tabulated_Result.xls`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const printTable = () => {
        const eventName = events.find(e => e.id == selectedEvent)?.name || 'Event';
        const roundName = rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound;

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>General Tabulated Result</title>
                <style>
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        body {
                            page-break-inside: avoid;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        .certification-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                        .signature-section {
                            page-break-inside: avoid !important;
                            page-break-before: avoid !important;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 100%;
                        position: relative;
                    }
                    .logo {
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 20px;
                        width: 80px;
                        height: auto;
                    }
                    .header-content {
                        text-align: center;
                        margin-bottom: 30px;
                        overflow: hidden;
                    }
                    h1 {
                        text-align: center;
                        font-size: 20px;
                        margin: 0;
                        padding-top: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 4px 6px;
                        text-align: center;
                    }
                    th {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <img src="${appLogo}" alt="Logo" class="logo" />
                <div class="header-content">
                    <h1>GENERAL TABULATED RESULT</h1>
                </div>
                <div style="clear: both;"></div>
                
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">NO</th>
                            <th rowspan="2">CONTESTANT</th>
                            ${judges.map(judge => `
                                <th colspan="2">${judge.name.toUpperCase()}</th>
                            `).join('')}
                            <th rowspan="2">AVG<br/>PERCENTAGE</th>
                            <th rowspan="2">FINAL RANK</th>
                        </tr>
                        <tr>
                            ${judges.map(() => `
                                <th>% SCORE</th>
                                <th>RANK</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${generalData.length === 0 ? `
                            <tr>
                                <td colspan="${2 + (judges.length * 2) + 2}" style="text-align: center; padding: 20px;">
                                    No data available
                                </td>
                            </tr>
                        ` : generalData.map((contestant, index) => {
                            // Get rank color
                            let rankColor = '#d1d5db'; // gray for others
                            if (contestant.overallRank === 1) rankColor = '#ef4444'; // red
                            else if (contestant.overallRank === 2) rankColor = '#22c55e'; // green
                            else if (contestant.overallRank === 3) rankColor = '#3b82f6'; // blue
                            else if (contestant.overallRank === 4) rankColor = '#38bdf8'; // sky
                            
                            return `
                            <tr>
                                <td style="background-color: ${rankColor}; color: white; font-weight: bold;">${contestant.sequence_no}</td>
                                <td style="text-align: left; padding-left: 10px;"><strong>${contestant.name}</strong></td>
                                ${contestant.judgeData.map(judge => `
                                    <td>${judge.percentage.toFixed(2)}%</td>
                                    <td><strong>${judge.rank}</strong></td>
                                `).join('')}
                                <td><strong>${contestant.avgPercentage.toFixed(2)}%</strong></td>
                                <td style="background-color: ${rankColor}; color: white; font-weight: bold;">
                                    ${contestant.overallRank}
                                </td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                
                <!-- Certification Statement -->
                <div class="certification-section" style="margin-top: 20px; text-align: center; font-style: italic; font-size: 12px;">
                    <p style="margin: 5px 0;">We hereby certify that the above results are true and correct.</p>
                </div>
                
                <!-- Signature Section -->
                <div class="signature-section" style="margin-top: 20px; display: flex; justify-content: space-around; flex-wrap: wrap;">
                    ${judges.map(judge => `
                        <div style="text-align: center; margin: 10px; min-width: 180px;">
                            <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto 8px auto; height: 40px;"></div>
                            <div style="font-weight: bold; font-size: 12px;">${judge.name.toUpperCase()}</div>
                            <div style="font-size: 10px; color: #666;">Signature</div>
                        </div>
                    `).join('')}
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0 px-4 py-6 bg-gray-50">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Event Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-2" />
                                Select Event
                            </label>
                            <select
                                value={selectedEvent || ''}
                                onChange={(e) => {
                                    setSelectedEvent(e.target.value);
                                    setSelectedRound(null);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Select Event --</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>
                                        {event.event_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Round Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-2" />
                                Select Round
                            </label>
                            <select
                                value={selectedRound || ''}
                                onChange={(e) => setSelectedRound(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedEvent}
                            >
                                <option value="">-- Select Round --</option>
                                {rounds.map(round => (
                                    <option key={round.id} value={round.round_no}>
                                        Round {round.round_no}{round.is_active ? ' (Active)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedEvent && selectedRound && (
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={() => fetchRoundData(selectedEvent, selectedRound)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh Data
                            </button>
                            <button
                                onClick={printGeneralTabulation}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print General Tabulated Result
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 bg-gray-50">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600 text-lg">Loading data...</p>
                    </div>
                )}

                {/* Judges Score Tables */}
                {!loading && selectedEvent && selectedRound && judges.length > 0 && (
                    <div className="space-y-8 py-4">
                    {judges.map(judge => {
                        const rankings = getJudgeRankings(judge.id);

                        return (
                            <div key={judge.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-300">
                                {/* Judge Header */}
                                <div className="bg-gray-800 text-white px-6 py-3">
                                    <h2 className="text-xl font-bold">{judge.name}</h2>
                                </div>

                                {/* Score Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-800">
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    No
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    Contestant
                                                </th>
                                                {criteria.map(criterion => (
                                                    <th
                                                        key={criterion.id}
                                                        className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300"
                                                    >
                                                        <div>{criterion.criteria_desc}</div>
                                                        <div className="text-xs text-gray-600 font-normal normal-case mt-1">
                                                            ({criterion.percentage}%)
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    Total Score
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase border-r border-gray-300">
                                                    Total Percentage
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase">
                                                    Rank
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rankings.map((ranking) => (
                                                <tr
                                                    key={ranking.id}
                                                    className="border-b border-gray-300 hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3 border-r border-gray-300">
                                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                                            <span className="text-black-500">{ranking.sequence_no}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-gray-300">
                                                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <span>{ranking.name}</span>
                                                        </div>
                                                    </td>
                                                    {criteria.map(criterion => {
                                                        const score = getScore(judge.id, ranking.id, criterion.id);
                                                        const hasScore = parseFloat(score) > 0;
                                                        
                                                        return (
                                                            <td
                                                                key={criterion.id}
                                                                className={`px-4 py-3 text-center border-r border-gray-300 ${
                                                                    hasScore ? 'bg-yellow-300' : ''
                                                                }`}
                                                            >
                                                                <span className="text-gray-900 font-medium">
                                                                    {score}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="px-4 py-3 text-center border-r border-gray-300">
                                                        <span className="font-bold text-gray-900">
                                                            {ranking.totalScore.toFixed(2)}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center border-r border-gray-300">
                                                        <span className="font-bold text-gray-900">
                                                            {ranking.percentage.toFixed(2)}%
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 text-center ${getRankBadgeColor(ranking.rank)}`}>
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-sm font-bold flex items-center gap-1">
                                                                <span>{ranking.rank}</span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

                {/* No Data State */}
                {!loading && selectedEvent && selectedRound && judges.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Award className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
                        <p className="text-gray-600">
                            No judges or scores found for the selected event and round.
                        </p>
                    </div>
                )}

                {/* Initial State */}
                {!loading && (!selectedEvent || !selectedRound) && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Filter className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Event and Round</h3>
                        <p className="text-gray-600">
                            Please select an event and round to view the score tables and rankings.
                        </p>
                    </div>
                )}
            </div>

            {/* Print Modal */}
            {showPrintModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">General Tabulated Result</h2>
                            <button
                                onClick={() => setShowPrintModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="mb-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {events.find(e => e.id == selectedEvent)?.name || 'Event'} - Round {rounds.find(r => r.round_no == selectedRound)?.round_no || selectedRound}
                                </h3>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-800 text-white">
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">NO</th>
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">CONTESTANT</th>
                                            {judges.map(judge => (
                                                <th key={judge.id} colSpan="2" className="border border-gray-300 px-4 py-2">
                                                    {judge.name.toUpperCase()}
                                                </th>
                                            ))}
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">AVG<br/>PERCENTAGE</th>
                                            <th rowSpan="2" className="border border-gray-300 px-4 py-2">RANK</th>
                                        </tr>
                                        <tr className="bg-gray-700 text-white">
                                            {judges.map(judge => (
                                                <React.Fragment key={judge.id}>
                                                    <th className="border border-gray-300 px-4 py-2">% SCORE</th>
                                                    <th className="border border-gray-300 px-4 py-2">RANK</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generalData.length === 0 ? (
                                            <tr>
                                                <td colSpan={2 + (judges.length * 2) + 2} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : generalData.map((contestant, index) => {
                                            let rankBgColor = 'bg-gray-400';
                                            if (contestant.overallRank === 1) rankBgColor = 'bg-red-500';
                                            else if (contestant.overallRank === 2) rankBgColor = 'bg-green-500';
                                            else if (contestant.overallRank === 3) rankBgColor = 'bg-blue-500';
                                            else if (contestant.overallRank === 4) rankBgColor = 'bg-sky-400';

                                            return (
                                                <tr key={contestant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center font-bold text-white ${rankBgColor}`}>
                                                        {contestant.sequence_no}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-left font-semibold">{contestant.name}</td>
                                                    {contestant.judgeData.map(judge => (
                                                        <React.Fragment key={judge.judgeId}>
                                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                                {judge.percentage.toFixed(2)}%
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                                                                {judge.rank}
                                                            </td>
                                                        </React.Fragment>
                                                    ))}
                                                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                                                        {contestant.avgPercentage.toFixed(2)}%
                                                    </td>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center font-bold text-white ${rankBgColor}`}>
                                                        {contestant.overallRank}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                Export to CSV
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Export to Excel
                            </button>
                            <button
                                onClick={printTable}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreTables;
