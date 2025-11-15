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
        $archivedEvents = Event::with(['contestants', 'criterias', 'actives'])
            ->where('is_archived', 1)
            ->orderBy('updated_at', 'desc')
            ->get();
        
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

            // Collect all data for archiving
            $archiveData = [
                'contestants' => [],
                'rounds' => []
            ];

            // Get all contestants with their rounds and scores
            foreach ($event->contestants as $contestant) {
                $contestantData = [
                    'id' => $contestant->id,
                    'name' => $contestant->contestant_name,
                    'sequence_no' => $contestant->sequence_no,
                    'photo' => $contestant->photo,
                    'rounds' => []
                ];

                // Get rounds for this contestant
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

            // Calculate final rankings
            $rankings = $this->calculateFinalRankings($event);

            // Create archive record
            ResultArchive::create([
                'event_id' => $event->id,
                'final_results' => json_encode($archiveData),
                'contestant_rankings' => json_encode($rankings),
                'notes' => $request->input('notes'),
                'archived_at' => now()
            ]);

            // Update event status
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
        $event = Event::with(['contestants', 'criterias', 'actives'])
            ->where('is_archived', 1)
            ->findOrFail($eventId);

        $archive = ResultArchive::where('event_id', $eventId)
            ->latest()
            ->first();

        if (!$archive) {
            return response()->json(['error' => 'Archive data not found'], 404);
        }

        $finalResults = json_decode($archive->final_results, true);
        $rankings = json_decode($archive->contestant_rankings, true);

        return response()->json([
            'event' => $event,
            'archive_data' => $finalResults,
            'rankings' => $rankings,
            'archived_at' => $archive->archived_at,
            'notes' => $archive->notes
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

        // Sort by total score descending
        usort($rankings, function($a, $b) {
            return $b['total_score'] <=> $a['total_score'];
        });

        // Add rank
        foreach ($rankings as $index => &$ranking) {
            $ranking['rank'] = $index + 1;
        }

        return $rankings;
    }
}
