<?php

namespace App\Http\Controllers\admin;

use App\Models\User;
use App\Models\Event;
use App\Models\Round;
use App\Models\Active;
use App\Models\Assign;
use App\Models\Criteria;
use App\Models\Contestant;
use App\Models\Tabulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ScoreController extends Controller
{
    /**
     * Get judges assigned to an event
     * 
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getJudgesByEvent($eventId)
    {
        try {
            $judges = User::whereHas('assigns', function($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })
            ->where('role_id', 2)
            ->where('is_active', 1)
            ->select('id', 'username as name')
            ->get();

            return response()->json($judges);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get criteria for a specific round
     * 
     * @param int $eventId
     * @param int $roundNo
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCriteriaByRound($eventId, $roundNo)
    {
        try {
            $active = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();

            if (!$active) {
                return response()->json([]);
            }

            $criteria = Criteria::where('event_id', $eventId)
                ->where('active_id', $active->id)
                ->where('is_active', 1)
                ->select('id', 'criteria_desc', 'definition', 'percentage')
                ->get();

            return response()->json($criteria);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all scores for a specific round
     * This includes all judges, all contestants, and all criteria scores
     * 
     * @param int $eventId
     * @param int $roundNo
     * @return \Illuminate\Http\JsonResponse
     */
    public function getScoresByRound($eventId, $roundNo)
    {
        try {
            // Get the active record for the round
            $active = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();

            if (!$active) {
                Log::warning('Active not found', ['event_id' => $eventId, 'round_no' => $roundNo]);
                return response()->json([]);
            }

            // Get all rounds for this active
            $rounds = Round::where('active_id', $active->id)->get();
            $roundIds = $rounds->pluck('id')->toArray();
            
            if (empty($roundIds)) {
                Log::warning('No rounds found', ['active_id' => $active->id]);
                return response()->json([]);
            }

            // Get all criteria for this round
            $criteriaIds = Criteria::where('event_id', $eventId)
                ->where('active_id', $active->id)
                ->where('is_active', 1)
                ->pluck('id')
                ->toArray();

            // Get all judges assigned to this event
            $judgeIds = Assign::where('event_id', $eventId)
                ->pluck('user_id')
                ->toArray();

            // Get all tabulations for these rounds - WITHOUT eager loading
            $tabulations = Tabulation::whereIn('round_id', $roundIds)
                ->whereIn('criteria_id', $criteriaIds)
                ->whereIn('user_id', $judgeIds)
                ->get();

            // Manually build the scores array to avoid broken relationships
            $scores = [];
            foreach ($tabulations as $tabulation) {
                // Find the round manually from our collection
                $round = $rounds->firstWhere('id', $tabulation->round_id);
                
                if ($round) {
                    $scores[] = [
                        'id' => $tabulation->id,
                        'judge_id' => $tabulation->user_id,
                        'contestant_id' => $round->contestant_id,
                        'criteria_id' => $tabulation->criteria_id,
                        'score' => (float)$tabulation->score,
                        'is_lock' => (int)$tabulation->is_lock,
                    ];
                }
            }

            Log::info('Scores retrieved', [
                'event_id' => $eventId,
                'round_no' => $roundNo,
                'tabulations_count' => $tabulations->count(),
                'scores_count' => count($scores)
            ]);

            return response()->json($scores);
        } catch (\Exception $e) {
            Log::error('getScoresByRound error', [
                'event_id' => $eventId,
                'round_no' => $roundNo,
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 
     * @param int $eventId
     * @param int $roundNo
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTabulationDataByRound($eventId, $roundNo)
    {
        try {
            $active = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();

            if (!$active) {
                return response()->json([
                    'contestants' => [],
                    'judges' => [],
                    'criteria' => [],
                    'scores' => []
                ]);
            }

            $contestants = Round::where('active_id', $active->id)
                ->with('contestant')
                ->get()
                ->map(function($round) {
                    return [
                        'id' => $round->contestant->id,
                        'contestant_name' => $round->contestant->contestant_name,
                        'photo' => $round->contestant->photo,
                        'sequence_no' => $round->contestant->sequence_no,
                    ];
                });

            $judges = User::whereHas('assigns', function($query) use ($eventId) {
                    $query->where('event_id', $eventId);
                })
                ->where('role_id', 2)
                ->where('is_active', 1)
                ->select('id', 'username as name')
                ->get();

            $criteria = Criteria::where('event_id', $eventId)
                ->where('active_id', $active->id)
                ->where('is_active', 1)
                ->select('id', 'criteria_desc', 'definition', 'percentage')
                ->get();

            $criteriaIds = $criteria->pluck('id')->toArray();
            $judgeIds = $judges->pluck('id')->toArray();

            $scores = Tabulation::whereHas('round', function($query) use ($active) {
                    $query->where('active_id', $active->id);
                })
                ->whereIn('criteria_id', $criteriaIds)
                ->whereIn('user_id', $judgeIds)
                ->with(['round.contestant', 'criteria', 'user'])
                ->get()
                ->map(function($tabulation) {
                    return [
                        'id' => $tabulation->id,
                        'judge_id' => $tabulation->user_id,
                        'contestant_id' => $tabulation->round->contestant_id,
                        'criteria_id' => $tabulation->criteria_id,
                        'score' => $tabulation->score,
                        'is_lock' => $tabulation->is_lock,
                    ];
                });

            return response()->json([
                'contestants' => $contestants,
                'judges' => $judges,
                'criteria' => $criteria,
                'scores' => $scores
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 
     * @param int $eventId
     * @param int $roundNo
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOverallRankings($eventId, $roundNo)
    {
        try {
            $active = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();

            if (!$active) {
                return response()->json([]);
            }

            $contestants = Round::where('active_id', $active->id)
                ->with('contestant')
                ->get();

            $criteria = Criteria::where('event_id', $eventId)
                ->where('active_id', $active->id)
                ->where('is_active', 1)
                ->get();

            $judges = User::whereHas('assigns', function($query) use ($eventId) {
                    $query->where('event_id', $eventId);
                })
                ->where('role_id', 2)
                ->where('is_active', 1)
                ->get();

            $rankings = [];

            foreach ($contestants as $round) {
                $contestant = $round->contestant;
                $totalPercentage = 0;
                $judgeCount = 0;

                foreach ($judges as $judge) {
                    $judgePercentage = 0;

                    foreach ($criteria as $criterion) {
                        $tabulation = Tabulation::where('round_id', $round->id)
                            ->where('user_id', $judge->id)
                            ->where('criteria_id', $criterion->id)
                            ->first();

                        if ($tabulation) {
                            $weightValue = $criterion->percentage / 100;
                            $judgePercentage += ($tabulation->score / 10) * $weightValue * 100;
                        }
                    }

                    $totalPercentage += $judgePercentage;
                    $judgeCount++;
                }

                $averagePercentage = $judgeCount > 0 ? $totalPercentage / $judgeCount : 0;

                $rankings[] = [
                    'contestant_id' => $contestant->id,
                    'contestant_name' => $contestant->contestant_name,
                    'average_percentage' => round($averagePercentage, 2),
                ];
            }

            usort($rankings, function($a, $b) {
                return $b['average_percentage'] <=> $a['average_percentage'];
            });

            $rank = 1;
            $previousPercentage = null;
            $sameRankCount = 0;

            foreach ($rankings as $index => &$ranking) {
                if ($previousPercentage !== null && $ranking['average_percentage'] < $previousPercentage) {
                    $rank += $sameRankCount;
                    $sameRankCount = 1;
                } else if ($previousPercentage === $ranking['average_percentage']) {
                    $sameRankCount++;
                } else {
                    $sameRankCount = 1;
                }
                
                $previousPercentage = $ranking['average_percentage'];
                $ranking['rank'] = $rank;
            }

            return response()->json($rankings);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update score from admin panel
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateScore(Request $request)
    {
        try {
            $request->validate([
                'judge_id' => 'required|exists:users,id',
                'contestant_id' => 'required|exists:contestants,id',
                'criteria_id' => 'required|exists:criterias,id',
                'event_id' => 'required|exists:events,id',
                'round_no' => 'required|integer',
                'score' => 'required|numeric|min:0|max:10',
            ]);

            $active = Active::where('event_id', $request->event_id)
                ->where('round_no', $request->round_no)
                ->first();

            if (!$active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Active round not found'
                ], 404);
            }

            $round = Round::where('active_id', $active->id)
                ->where('contestant_id', $request->contestant_id)
                ->first();

            if (!$round) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contestant not found in this round'
                ], 404);
            }

            $tabulation = Tabulation::updateOrCreate(
                [
                    'round_id' => $round->id,
                    'user_id' => $request->judge_id,
                    'criteria_id' => $request->criteria_id,
                ],
                [
                    'score' => $request->score,
                ]
            );

            event(new \App\Events\JudgeScores($tabulation));

            return response()->json([
                'success' => true,
                'message' => 'Score updated successfully',
                'tabulation' => $tabulation
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update score: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function notifyJudge(Request $request)
    {
        try {
            
            $judgeId = $request->input('judge_id');
            $eventId = $request->input('event_id');
            $roundNo = $request->input('round_no');
            $message = $request->input('message', 'Please enter your scores as soon as possible.');

            $judge = User::find($judgeId);
            
            if (!$judge) {
                return response()->json(['success' => false, 'message' => 'Judge not found'], 404);
            }

            $event = Event::find($eventId);
            
            if (!$event) {
                return response()->json(['success' => false, 'message' => 'Event not found'], 404);
            }

            $notificationData = [
                'judge_id' => $judgeId,
                'event_id' => $eventId,
                'message' => $message,
                'timestamp' => now()->toDateTimeString()
            ];

            event(new \App\Events\JudgeNotification($notificationData));


            return response()->json(['success' => true, 'message' => 'Notification sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Import scores from previous rounds with weighted calculation
     * This calculates weighted average scores from previous round and imports them
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function importScoresFromPreviousRound(Request $request)
    {
        try {
            $request->validate([
                'event_id' => 'required|exists:events,id',
                'source_round_no' => 'required|integer|min:1',
                'target_round_no' => 'required|integer|min:1',
                'target_criteria_id' => 'required|exists:criterias,id',
                'contestant_ids' => 'required|array|min:1',
                'contestant_ids.*' => 'exists:contestants,id',
            ]);

            $eventId = $request->event_id;
            $sourceRoundNo = $request->source_round_no;
            $targetRoundNo = $request->target_round_no;
            $targetCriteriaId = $request->target_criteria_id;
            $contestantIds = $request->contestant_ids;

            if ($sourceRoundNo >= $targetRoundNo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Source round must be before target round'
                ], 400);
            }

            // Get source active round
            $sourceActive = Active::where('event_id', $eventId)
                ->where('round_no', $sourceRoundNo)
                ->first();

            if (!$sourceActive) {
                return response()->json([
                    'success' => false,
                    'message' => 'Source round not found'
                ], 404);
            }

            // Get target active round
            $targetActive = Active::where('event_id', $eventId)
                ->where('round_no', $targetRoundNo)
                ->first();

            if (!$targetActive) {
                return response()->json([
                    'success' => false,
                    'message' => 'Target round not found'
                ], 404);
            }

            // Verify target criteria exists and belongs to target round
            $targetCriteria = Criteria::where('id', $targetCriteriaId)
                ->where('active_id', $targetActive->id)
                ->where('is_active', 1)
                ->first();

            if (!$targetCriteria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Target criteria not found in target round'
                ], 404);
            }

            // Get all criteria from source round for weighting
            $sourceCriteria = Criteria::where('active_id', $sourceActive->id)
                ->where('is_active', 1)
                ->get();

            if ($sourceCriteria->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No criteria found in source round'
                ], 404);
            }

            // Get all judges assigned to this event
            $judges = User::whereHas('assigns', function($query) use ($eventId) {
                    $query->where('event_id', $eventId);
                })
                ->where('role_id', 2)
                ->where('is_active', 1)
                ->get();

            if ($judges->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No judges found for this event'
                ], 404);
            }

            $importedCount = 0;
            $skippedCount = 0;

            foreach ($contestantIds as $contestantId) {
                // Find contestant's round in source
                $sourceRound = Round::where('active_id', $sourceActive->id)
                    ->where('contestant_id', $contestantId)
                    ->first();

                if (!$sourceRound) {
                    $skippedCount++;
                    continue;
                }

                // Find contestant's round in target
                $targetRound = Round::where('active_id', $targetActive->id)
                    ->where('contestant_id', $contestantId)
                    ->first();

                if (!$targetRound) {
                    $skippedCount++;
                    continue;
                }

                // Calculate weighted average score for this contestant
                $judgePercentages = [];

                foreach ($judges as $judge) {
                    $judgeTotal = 0;

                    // Get all scores from this judge for this contestant in source round
                    foreach ($sourceCriteria as $criterion) {
                        $tabulation = Tabulation::where('round_id', $sourceRound->id)
                            ->where('user_id', $judge->id)
                            ->where('criteria_id', $criterion->id)
                            ->first();

                        if ($tabulation) {
                            // Calculate weighted score: (score / 10) * (percentage / 100) * 100
                            // Example: score=9, percentage=40 → (9/10) * (40/100) * 100 = 36%
                            $weightValue = $criterion->percentage / 100;
                            $judgeTotal += ($tabulation->score / 10) * $weightValue * 100;
                        }
                    }

                    $judgePercentages[] = $judgeTotal;
                }

                // Calculate average percentage across all judges
                $avgPercentage = count($judgePercentages) > 0 
                    ? array_sum($judgePercentages) / count($judgePercentages) 
                    : 0;

                // Convert percentage to rating score (0-10 scale)
                // Example: 87.5% → 87.5 * 10 / 100 = 8.75
                $ratingScore = ($avgPercentage * 10) / 100;

                // Round to 2 decimal places
                $ratingScore = round($ratingScore, 2);

                // Import this calculated score for ALL judges in target round
                foreach ($judges as $judge) {
                    Tabulation::updateOrCreate(
                        [
                            'round_id' => $targetRound->id,
                            'user_id' => $judge->id,
                            'criteria_id' => $targetCriteriaId,
                        ],
                        [
                            'score' => $ratingScore,
                            'is_lock' => false
                        ]
                    );
                }

                $importedCount++;
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully imported calculated scores for {$importedCount} contestant(s). {$skippedCount} contestant(s) skipped.",
                'imported_count' => $importedCount,
                'skipped_count' => $skippedCount
            ]);

        } catch (\Exception $e) {
            Log::error('importScoresFromPreviousRound error', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to import scores: ' . $e->getMessage()
            ], 500);
        }
    }
}
