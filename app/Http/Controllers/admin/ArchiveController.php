<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\ResultArchive;
use App\Models\Contestant;
use App\Models\Round;
use App\Models\Tabulation;
use App\Models\Criteria;
use App\Models\Active;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArchiveController extends Controller
{
    public function getArchivedEvents()
    {
        // Get events that are either:
        // 1. Marked as archived (is_archived = 1), OR
        // 2. Have result archive data (from sync)
        $archivedEventIds = ResultArchive::pluck('event_id')->unique()->toArray();
        
        $archivedEvents = Event::with(['contestants', 'criterias', 'actives', 'medalTallies'])
            ->where(function($query) use ($archivedEventIds) {
                $query->where('is_archived', 1)
                      ->orWhereIn('id', $archivedEventIds);
            })
            ->orderBy('updated_at', 'desc')
            ->get();
        
        // Add medal tally information and archive status to each event
        $archivedEvents->transform(function ($event) {
            $medalTally = $event->medalTallies->first();
            $event->medal_tally_name = $medalTally ? $medalTally->tally_title : null;
            
            // Check if this event has archive data
            $hasArchiveData = ResultArchive::where('event_id', $event->id)->exists();
            $event->has_archive_data = $hasArchiveData;
            $event->is_medal_tally_event = $medalTally !== null;
            
            return $event;
        });
        
        return response()->json($archivedEvents);
    }

    public function archiveEvent(Request $request, $eventId)
    {
        DB::beginTransaction();
        try {
            $event = Event::with([
                'contestants',
                'criterias',
                'actives.rounds.tabulations'
            ])->findOrFail($eventId);

            $archiveData = [
                'contestants' => [],
                'rounds' => []
            ];

            foreach ($event->contestants as $contestant) {
                $contestantData = [
                    'id' => $contestant->id,
                    'name' => $contestant->contestant_name,
                    'sequence_no' => $contestant->sequence_no,
                    'photo' => $contestant->photo,
                    'rounds' => []
                ];

                $rounds = Round::where('contestant_id', $contestant->id)
                    ->with(['active', 'tabulations.criteria', 'tabulations.user'])
                    ->get();

                foreach ($rounds as $round) {
                    $roundData = [
                        'round_no' => $round->active->round_no,
                        'scores' => []
                    ];

                    foreach ($round->tabulations as $tabulation) {
                        $roundData['scores'][] = [
                            'criteria' => $tabulation->criteria->criteria_desc,
                            'judge' => $tabulation->user->username,
                            'score' => $tabulation->score,
                            'percentage' => $tabulation->criteria->percentage
                        ];
                    }

                    $contestantData['rounds'][] = $roundData;
                }

                $archiveData['contestants'][] = $contestantData;
            }

            $rankings = $this->calculateFinalRankings($event);

            ResultArchive::create([
                'event_id' => $event->id,
                'final_results' => json_encode($archiveData),
                'contestant_rankings' => json_encode($rankings),
                'notes' => $request->input('notes'),
                'archived_at' => now()
            ]);

            $event->update([
                'is_archived' => 1,
                'is_active' => 0
            ]);

            DB::commit();
            
            return response()->json([
                'message' => 'Event archived successfully',
                'event' => $event
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to archive event',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getArchivedEventDetails($eventId)
    {
        // Get the event first
        $event = Event::with(['contestants', 'criterias', 'actives', 'medalTallies'])
            ->findOrFail($eventId);

        // Check if result archive exists for this event
        $archive = ResultArchive::where('event_id', $eventId)
            ->latest()
            ->first();

        if (!$archive) {
            // No archive data - calculate rankings from tabulations table
            Log::info("No archive data found, calculating from tabulations", ['event_id' => $eventId]);
            
            $rankings = $this->calculateRankingsFromTabulations($event);
            $finalResults = $this->buildResultsFromTabulations($event);
            
            // Get medal tally information
            $medalTally = $event->medalTallies->first();
            $medalTallyName = $medalTally ? $medalTally->tally_title : null;
            
            return response()->json([
                'event' => $event,
                'archive_data' => $finalResults,
                'rankings' => $rankings,
                'archived_at' => $event->updated_at,
                'notes' => null,
                'medal_tally_name' => $medalTallyName,
                'calculated_on_fly' => true
            ]);
        }

        $finalResults = json_decode($archive->final_results, true);
        $rankings = json_decode($archive->contestant_rankings, true);

        // Get medal tally information
        $medalTally = $event->medalTallies->first();
        $medalTallyName = $medalTally ? $medalTally->tally_title : null;

        return response()->json([
            'event' => $event,
            'archive_data' => $finalResults,
            'rankings' => $rankings,
            'archived_at' => $archive->archived_at,
            'notes' => $archive->notes,
            'medal_tally_name' => $medalTallyName,
            'calculated_on_fly' => false
        ]);
    }

    public function unarchiveEvent($eventId)
    {
        DB::beginTransaction();
        try {
            $event = Event::findOrFail($eventId);
            
            $event->update([
                'is_archived' => 0,
                'is_active' => 1
            ]);

            DB::commit();
            
            return response()->json([
                'message' => 'Event unarchived successfully',
                'event' => $event
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to unarchive event'
            ], 500);
        }
    }

    private function calculateRankingsFromTabulations($event)
    {
        // Use the existing calculateFinalRankings method
        return $this->calculateFinalRankings($event);
    }

    private function buildResultsFromTabulations($event)
    {
        $results = [
            'contestants' => []
        ];

        foreach ($event->contestants as $contestant) {
            $contestantData = [
                'id' => $contestant->id,
                'name' => $contestant->contestant_name,
                'sequence_no' => $contestant->sequence_no,
                'photo' => $contestant->photo,
                'rounds' => []
            ];

            $rounds = Round::where('contestant_id', $contestant->id)
                ->with(['active', 'tabulations.criteria', 'tabulations.user'])
                ->get();

            foreach ($rounds as $round) {
                $roundData = [
                    'round_no' => $round->active->round_no ?? 'N/A',
                    'scores' => []
                ];

                foreach ($round->tabulations as $tabulation) {
                    $roundData['scores'][] = [
                        'criteria' => $tabulation->criteria->criteria_desc ?? 'N/A',
                        'judge' => $tabulation->user->username ?? 'N/A',
                        'score' => $tabulation->score,
                        'percentage' => $tabulation->criteria->percentage ?? 0
                    ];
                }

                $contestantData['rounds'][] = $roundData;
            }

            $results['contestants'][] = $contestantData;
        }

        return $results;
    }

    private function calculateFinalRankings($event)
    {
        $rankings = [];
        
        foreach ($event->contestants as $contestant) {
            $totalScore = 0;
            $scoreCount = 0;

            $rounds = Round::where('contestant_id', $contestant->id)
                ->with('tabulations.criteria')
                ->get();

            foreach ($rounds as $round) {
                foreach ($round->tabulations as $tabulation) {
                    $percentageScore = ($tabulation->score / $tabulation->criteria->max_percentage) * $tabulation->criteria->percentage;
                    $totalScore += $percentageScore;
                    $scoreCount++;
                }
            }

            $rankings[] = [
                'contestant_id' => $contestant->id,
                'contestant_name' => $contestant->contestant_name,
                'total_score' => round($totalScore, 2),
                'average_score' => $scoreCount > 0 ? round($totalScore / $scoreCount, 2) : 0
            ];
        }

        usort($rankings, function($a, $b) {
            return $b['total_score'] <=> $a['total_score'];
        });

        foreach ($rankings as $index => &$ranking) {
            $ranking['rank'] = $index + 1;
        }

        return $rankings;
    }
}
