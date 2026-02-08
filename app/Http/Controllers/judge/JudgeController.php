<?php

namespace App\Http\Controllers\judge;

use Log;
use Inertia\Inertia;
use App\Models\Round;
use App\Models\Active;
use App\Models\Assign;
use App\Models\Criteria;
use App\Models\Contestant;
use App\Models\Tabulation;
use App\Events\JudgeScores;
use Illuminate\Http\Request;
use App\Events\JudgeHelpRequested;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class JudgeController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function getTabulationData(Request $request){
        try {
            $judge = Auth::user();

            // Get all assignments for this judge and filter for active, non-archived events
            $assignedEvent = Assign::where('user_id', $judge->id)
                ->whereHas('event', function($query) {
                    $query->where('is_active', true)
                          ->where('is_archived', 0);
                })
                ->with(['event' => function($query) {
                    $query->where('is_active', true)
                          ->where('is_archived', 0)
                          ->select('id', 'event_name', 'event_type', 'description');
                }])
                ->first();

            if (!$assignedEvent || !$assignedEvent->event) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active assigned event found'
                ], 404);
            }

            $event = $assignedEvent->event;
    
            // Get the currently active round
            $activeRound = Active::where('event_id', $event->id)
                ->where('is_active', true)
                ->select('id', 'event_id', 'round_no', 'is_active')
                ->first();
    
            if (!$activeRound) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active round found for this event'
                ], 404);
            }

            // Check if judge is requesting a specific round
            $requestedRoundNo = $request->query('round_no');
            $viewingRound = $activeRound;
            
            if ($requestedRoundNo && $requestedRoundNo != $activeRound->round_no) {
                $viewingRound = Active::where('event_id', $event->id)
                    ->where('round_no', $requestedRoundNo)
                    ->first();
                    
                if (!$viewingRound) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Requested round not found'
                    ], 404);
                }
            }

            // Determine if scores should be locked
            // Scores are locked if viewing a previous round (round_no < active round_no)
            $isLocked = $viewingRound->round_no < $activeRound->round_no;
    
            // Get all available rounds for this event
            $allRounds = Active::where('event_id', $event->id)
                ->orderBy('round_no')
                ->select('id', 'round_no', 'is_active')
                ->get();

            // Get all criteria for this active round (don't wait for tabulations)
            $criteria = Criteria::where('active_id', $viewingRound->id)
                ->where('is_active', 1)
                ->select('id', 'criteria_desc', 'definition', 'percentage', 'max_percentage', 'active_id')
                ->orderBy('id')
                ->get();
    
            // Get round IDs for this active round
            $roundIds = DB::table('rounds')
                ->where('active_id', $viewingRound->id)
                ->pluck('id');
            
            // Check if there are any rounds at all
            if ($roundIds->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'event' => [
                            'id' => $event->id,
                            'event_name' => $event->event_name,
                            'event_type' => $event->event_type,
                            'description' => $event->description,
                        ],
                        'active_round' => [
                            'id' => $activeRound->id,
                            'round_no' => $activeRound->round_no,
                            'is_active' => $activeRound->is_active,
                        ],
                        'viewing_round' => [
                            'id' => $viewingRound->id,
                            'round_no' => $viewingRound->round_no,
                            'is_active' => $viewingRound->is_active,
                        ],
                        'available_rounds' => $allRounds,
                        'is_locked' => $isLocked,
                        'contestants' => [],
                        'criteria_summary' => [
                            'total_criteria' => $criteria->count(),
                            'total_percentage' => $criteria->sum('percentage')
                        ],
                        'judge_info' => [
                            'judge_id' => $judge->id,
                            'judge_name' => $judge->username
                        ]
                    ]
                ]);
            }
            
            // Get ALL contestant IDs from rounds (not just those with tabulations)
            $contestantIds = DB::table('rounds')
                ->where('active_id', $viewingRound->id)
                ->distinct()
                ->pluck('contestant_id');
            
            // Get all contestants in this round with their round info (single query)
            $contestants = Contestant::whereIn('id', $contestantIds)
                ->with(['rounds' => function($query) use ($viewingRound) {
                    $query->where('active_id', $viewingRound->id)
                          ->select('id', 'contestant_id', 'active_id');
                }])
                ->select('id', 'contestant_name', 'photo', 'sequence_no')
                ->orderBy('sequence_no')
                ->get();
    
            // Fetch existing scores for this judge in a single optimized query
            $existingScores = DB::table('tabulations')
                ->join('rounds', 'tabulations.round_id', '=', 'rounds.id')
                ->whereIn('tabulations.round_id', $roundIds)
                ->where('tabulations.user_id', $judge->id)
                ->select('tabulations.id', 'tabulations.criteria_id', 'tabulations.score', 'tabulations.is_lock', 'rounds.contestant_id')
                ->get()
                ->groupBy('contestant_id');
    
            $formattedData = [
                'event' => [
                    'id' => $event->id,
                    'event_name' => $event->event_name,
                    'event_type' => $event->event_type,
                    'description' => $event->description,
                ],
                'active_round' => [
                    'id' => $activeRound->id,
                    'round_no' => $activeRound->round_no,
                    'is_active' => $activeRound->is_active,
                ],
                'viewing_round' => [
                    'id' => $viewingRound->id,
                    'round_no' => $viewingRound->round_no,
                    'is_active' => $viewingRound->is_active,
                ],
                'available_rounds' => $allRounds,
                'is_locked' => $isLocked,
                'contestants' => $contestants->map(function($contestant) use ($existingScores, $criteria, $viewingRound, $isLocked) {
                    $contestantScores = $existingScores->get($contestant->id, collect());
                    $round = $contestant->rounds->first();
                    
                    $criteriaWithScores = [];
                    $totalScore = 0;
                    
                    foreach ($criteria as $criterion) {
                        $scoreRecord = $contestantScores->firstWhere('criteria_id', $criterion->id);
                        // Format score properly - return as formatted decimal string or empty string
                        $score = '';
                        if ($scoreRecord && $scoreRecord->score && $scoreRecord->score > 0) {
                            $score = number_format($scoreRecord->score, 2, '.', '');
                        }
                        
                        $criteriaWithScores[] = [
                            'id' => $criterion->id,
                            'criteria_desc' => $criterion->criteria_desc,
                            'definition' => $criterion->definition,
                            'percentage' => $criterion->percentage,
                            'max_percentage' => $criterion->max_percentage,
                            'score' => $score,
                            'tabulation_id' => $scoreRecord ? $scoreRecord->id : null,
                            'is_lock' => $isLocked || ($scoreRecord ? $scoreRecord->is_lock : false)
                        ];
                        
                        $totalScore += $scoreRecord && $scoreRecord->score ? floatval($scoreRecord->score) : 0;
                    }
    
                    return [
                        'id' => $contestant->id,
                        'contestant_name' => $contestant->contestant_name,
                        'photo' => $contestant->photo,
                        'sequence_no' => $contestant->sequence_no,
                        'round_id' => $round ? $round->id : null,
                        'criteria' => $criteriaWithScores,
                        'total_score' => $totalScore
                    ];
                })->values()->all(),
                'criteria_summary' => [
                    'total_criteria' => $criteria->count(),
                    'total_percentage' => $criteria->sum('percentage')
                ],
                'judge_info' => [
                    'judge_id' => $judge->id,
                    'judge_name' => $judge->username
                ]
            ];
    
            return response()->json([
                'success' => true,
                'data' => $formattedData
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch tabulation data: ' . $e->getMessage()
            ], 500);
        }
    }
    public function updateScore(Request $request){
    try {
        $judge = Auth::user();
        
        $request->validate([
            'criteria_id' => 'required|exists:criterias,id',
            'score' => 'required|numeric|min:0|max:10',
            'tabulation_id' => 'nullable|exists:tabulations,id',
            'contestant_id' => 'required|exists:contestants,id',
            'round_id' => 'required|exists:rounds,id'
        ]);

        // Get the round to check if it's from a previous round
        $round = Round::findOrFail($request->round_id);
        $roundActive = Active::findOrFail($round->active_id);
        
        // Get the current active round for this event
        $currentActiveRound = Active::where('event_id', $roundActive->event_id)
            ->where('is_active', true)
            ->first();
        
        // Check if trying to update a score from a previous round
        if ($currentActiveRound && $roundActive->round_no < $currentActiveRound->round_no) {
            return response()->json([
                'success' => false,
                'error' => 'Cannot update scores from previous rounds. Scores are locked.'
            ], 403);
        }

        // If tabulation_id is provided, update existing record
        if ($request->tabulation_id) {
            $tabulation = Tabulation::where('id', $request->tabulation_id)
                ->where('user_id', $judge->id)
                ->firstOrFail();

            // Check if the score is locked
            if ($tabulation->is_lock) {
                return response()->json([
                    'success' => false,
                    'error' => 'This score is locked and cannot be modified'
                ], 403);
            }

            $tabulation->update([
                'score' => $request->score
            ]);
        } else {
            // Create new record if it doesn't exist
            $tabulation = Tabulation::create([
                'round_id' => $request->round_id,
                'user_id' => $judge->id,
                'criteria_id' => $request->criteria_id,
                'score' => $request->score,
                'is_lock' => false
            ]);
        }

        // Broadcast the score update to all other connected clients
        broadcast(new JudgeScores($tabulation))->toOthers();

        // Return a simple success response for Inertia
        return response()->json([
            'success' => true,
            'tabulation' => $tabulation
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Failed to update score: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Request help from admin
     */
    public function requestHelp(Request $request)
    {
        try {
            $judge = Auth::user();
            
            // Get assigned event - only active, non-archived events
            $assignedEvent = Assign::where('user_id', $judge->id)
                ->whereHas('event', function($query) {
                    $query->where('is_active', true)
                          ->where('is_archived', 0);
                })
                ->with(['event' => function($query) {
                    $query->where('is_active', true)
                          ->where('is_archived', 0);
                }])
                ->first();

            if (!$assignedEvent || !$assignedEvent->event) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active assigned event found'
                ], 404);
            }

            $event = $assignedEvent->event;

            // Get active round
            $activeRound = Active::where('event_id', $event->id)
                ->where('is_active', true)
                ->first();

            if (!$activeRound) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active round found'
                ], 404);
            }
            
            event(new JudgeHelpRequested(
                $judge->username,
                $judge->id,
                $event->event_name,
                $activeRound->round_no
            ));

            return response()->json([
                'success' => true,
                'message' => 'Help request sent to admin successfully',
                'data' => [
                    'judgeName' => $judge->username,
                    'judgeId' => $judge->id,
                    'eventName' => $event->event_name,
                    'roundNumber' => $activeRound->round_no
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to send help request: ' . $e->getMessage()
            ], 500);
        }
    }
}
