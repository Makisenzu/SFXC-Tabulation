<?php

namespace App\Http\Controllers\admin;

use App\Models\User;
use App\Models\Event;
use App\Models\Active;
use App\Models\Assign;
use App\Models\Criteria;
use App\Models\Contestant;
use App\Models\Round;
use App\Models\Tabulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                return response()->json([]);
            }

            // Get all contestants in this round
            $contestantIds = Round::where('active_id', $active->id)
                ->pluck('contestant_id')
                ->toArray();

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

            // Get all tabulation records (scores) for this round
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

            return response()->json($scores);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all tabulation data for a specific event and round
     * This is a comprehensive endpoint that returns everything needed for the ScoreTables component
     * 
     * @param int $eventId
     * @param int $roundNo
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTabulationDataByRound($eventId, $roundNo)
    {
        try {
            // Get the active record for the round
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

            // Get contestants in this round
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

            // Get judges assigned to this event
            $judges = User::whereHas('assigns', function($query) use ($eventId) {
                    $query->where('event_id', $eventId);
                })
                ->where('role_id', 2)
                ->where('is_active', 1)
                ->select('id', 'username as name')
                ->get();

            // Get criteria for this round
            $criteria = Criteria::where('event_id', $eventId)
                ->where('active_id', $active->id)
                ->where('is_active', 1)
                ->select('id', 'criteria_desc', 'definition', 'percentage')
                ->get();

            // Get all scores
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
     * Get overall rankings across all judges for a specific round
     * 
     * @param int $eventId
     * @param int $roundNo
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOverallRankings($eventId, $roundNo)
    {
        try {
            // Get the active record for the round
            $active = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();

            if (!$active) {
                return response()->json([]);
            }

            // Get all contestants in this round
            $contestants = Round::where('active_id', $active->id)
                ->with('contestant')
                ->get();

            // Get all criteria for this round
            $criteria = Criteria::where('event_id', $eventId)
                ->where('active_id', $active->id)
                ->where('is_active', 1)
                ->get();

            // Get all judges assigned to this event
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

            // Sort by average percentage (descending)
            usort($rankings, function($a, $b) {
                return $b['average_percentage'] <=> $a['average_percentage'];
            });

            // Assign ranks
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
     * Send notification to judge to enter scores
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function notifyJudge(Request $request)
    {
        try {
            \Log::info('Notify judge request received', $request->all());
            
            $judgeId = $request->input('judge_id');
            $eventId = $request->input('event_id');
            $roundNo = $request->input('round_no');
            $message = $request->input('message', 'Please enter your scores as soon as possible.');

            // Get judge info
            $judge = User::find($judgeId);
            
            if (!$judge) {
                \Log::error('Judge not found', ['judge_id' => $judgeId]);
                return response()->json(['success' => false, 'message' => 'Judge not found'], 404);
            }

            // Get event info
            $event = Event::find($eventId);
            
            if (!$event) {
                \Log::error('Event not found', ['event_id' => $eventId]);
                return response()->json(['success' => false, 'message' => 'Event not found'], 404);
            }

            $notificationData = [
                'judge_id' => $judgeId,
                'event_id' => $eventId,
                'event_name' => $event->event_name,
                'round_no' => $roundNo,
                'message' => $message,
                'timestamp' => now()->toDateTimeString()
            ];

            \Log::info('Broadcasting notification', $notificationData);

            // Broadcast notification to judge
            event(new \App\Events\JudgeNotification($notificationData));

            \Log::info('Notification broadcast successfully');

            return response()->json(['success' => true, 'message' => 'Notification sent successfully']);
        } catch (\Exception $e) {
            \Log::error('Error in notifyJudge', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
