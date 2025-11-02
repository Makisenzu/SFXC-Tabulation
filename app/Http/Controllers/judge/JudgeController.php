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
            $assignedEvent = Assign::where('user_id', $judge->id)
                ->with(['event' => function($query) {
                    $query->where('is_active', true);
                }])
                ->first();

            if (!$assignedEvent || !$assignedEvent->event) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active event assigned to this judge'
                ], 404);
            }

            $event = $assignedEvent->event;

            // Get active round for this event
            $activeRound = Active::where('event_id', $event->id)
                ->where('is_active', true)
                ->first();

            if (!$activeRound) {
                return response()->json([
                    'success' => false,
                    'error' => 'No active round found for this event'
                ], 404);
            }

            // Get contestants in this active round
            $contestants = Contestant::whereHas('rounds', function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                })
                ->with(['rounds' => function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                }])
                ->orderBy('sequence_no')
                ->get();

            // Get criteria for this active round
            $criteria = Criteria::where('active_id', $activeRound->id)
                ->where('is_active', 1)
                ->orderBy('id')
                ->get();

            // Get existing scores for this judge from tabulations table
            $existingScores = Tabulation::where('user_id', $judge->id)
                ->whereHas('round', function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                })
                ->with(['criteria', 'round.contestant'])
                ->get()
                ->groupBy('round.contestant_id');

            // Format the response data
            $tabulationData = [
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
                'contestants' => $contestants->map(function($contestant) use ($existingScores, $criteria, $judge) {
                    $contestantScores = $existingScores->get($contestant->id, collect());
                    
                    $criteriaWithScores = $criteria->map(function($criterion) use ($contestantScores, $contestant) {
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
                        'round_id' => $contestant->rounds->first()->id,
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
                    'judge_name' => $judge->name
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $tabulationData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch tabulation data: ' . $e->getMessage()
            ], 500);
        }
    }
    public function index()
    {
        //
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
