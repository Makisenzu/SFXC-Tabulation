<?php

namespace App\Http\Controllers\judge;

use Inertia\Inertia;
use App\Models\Active;
use App\Models\Assign;
use App\Models\Criteria;
use App\Models\Contestant;
use App\Models\Tabulation;
use Illuminate\Http\Request;
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
            
            // get judges event
            $assignedEvent = Assign::where('user_id', $judge->id)
                ->with(['event' => function($query) {
                    $query->where('is_active', true);
                }])
                ->first();
    
            if (!$assignedEvent || !$assignedEvent->event) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active assigned event found'
                ], 404);
            }
    
            $event = $assignedEvent->event;
    
            // check active round
            $activeRound = Active::where('event_id', $event->id)
                ->where('is_active', true)
                ->first();
    
            if (!$activeRound) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active round found for this event'
                ], 404);
            }
    
            // checking data
            $hasTabulationData = Tabulation::where('user_id', $judge->id)
                ->whereHas('round', function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                })
                ->exists();
    
            // empty response
            if (!$hasTabulationData) {
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
                        'contestants' => [],
                        'criteria_summary' => [
                            'total_criteria' => 0,
                            'total_percentage' => 0
                        ],
                        'judge_info' => [
                            'judge_id' => $judge->id,
                            'judge_name' => $judge->username
                        ]
                    ]
                ]);
            }
    
            //criteria query
            $criteria = Criteria::where('active_id', $activeRound->id)
                ->where('is_active', 1)
                ->whereHas('tabulations', function($query) use ($judge, $activeRound) {
                    $query->where('user_id', $judge->id)
                          ->whereHas('round', function($q) use ($activeRound) {
                              $q->where('active_id', $activeRound->id);
                          });
                })
                ->orderBy('id')
                ->get();
    
            //contestants query
            $contestants = Contestant::whereHas('rounds.tabulations', function($query) use ($judge, $activeRound) {
                    $query->where('user_id', $judge->id)
                          ->whereHas('round', function($q) use ($activeRound) {
                              $q->where('active_id', $activeRound->id);
                          });
                })
                ->with(['rounds' => function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                }])
                ->orderBy('sequence_no')
                ->get();
    
            // 5. existing scores
            $existingScores = Tabulation::where('user_id', $judge->id)
                ->whereHas('round', function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                })
                ->with(['criteria', 'round.contestant'])
                ->get()
                ->groupBy('round.contestant_id');
    
            //  response data
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
                'contestants' => $contestants->map(function($contestant) use ($existingScores, $criteria, $activeRound) {
                    $contestantScores = $existingScores->get($contestant->id, collect());
                    
                    //round iD for contestant round
                    $round = $contestant->rounds->firstWhere('active_id', $activeRound->id);
                    
                    $criteriaWithScores = $criteria->map(function($criterion) use ($contestantScores) {
                        $scoreRecord = $contestantScores->firstWhere('criteria_id', $criterion->id);
                        
                        return [
                            'id' => $criterion->id,
                            'criteria_desc' => $criterion->criteria_desc,
                            'definition' => $criterion->definition,
                            'percentage' => $criterion->percentage,
                            'max_percentage' => $criterion->max_percentage,
                            'score' => $scoreRecord ? $scoreRecord->score : 0,
                            'tabulation_id' => $scoreRecord ? $scoreRecord->id : null,
                            'is_lock' => $scoreRecord ? $scoreRecord->is_lock : false
                        ];
                    });
    
                    return [
                        'id' => $contestant->id,
                        'contestant_name' => $contestant->contestant_name,
                        'photo' => $contestant->photo,
                        'sequence_no' => $contestant->sequence_no,
                        'round_id' => $round ? $round->id : null,
                        'criteria' => $criteriaWithScores,
                        'total_score' => $criteriaWithScores->sum('score')
                    ];
                }),
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

        // If tabulation_id is provided, update existing record
        if ($request->tabulation_id) {
            $tabulation = Tabulation::where('id', $request->tabulation_id)
                ->where('user_id', $judge->id)
                ->firstOrFail();

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
}
