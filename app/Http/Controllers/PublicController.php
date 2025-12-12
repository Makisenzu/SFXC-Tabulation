<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\MedalTally;
use App\Models\ResultArchive;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home()
    {
        return inertia('Public/Home');
    }

    public function liveResults()
    {
        // Get all active, non-archived events
        $activeEvents = Event::where('is_active', 1)
            ->where('is_archived', 0)
            ->with(['contestants', 'actives'])
            ->orderBy('event_start', 'desc')
            ->get();

        return inertia('Public/LiveResults', [
            'events' => $activeEvents
        ]);
    }

    public function medalTally()
    {
        // Get all medal tallies
        $tallies = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Public/MedalTally', [
            'tallies' => $tallies
        ]);
    }

    public function archives()
    {
        // Get events that are either:
        // 1. Marked as archived (is_archived = 1), OR
        // 2. Have result archive data (from sync)
        $archivedEventIds = ResultArchive::pluck('event_id')->unique()->toArray();
        
        $archivedEvents = Event::where(function($query) use ($archivedEventIds) {
                $query->where('is_archived', 1)
                      ->orWhereIn('id', $archivedEventIds);
            })
            ->with('contestants')
            ->orderBy('updated_at', 'desc')
            ->get();

        return inertia('Public/Archives', [
            'archivedEvents' => $archivedEvents
        ]);
    }

    public function archiveDetails($eventId)
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
            $rankings = $this->calculateRankingsFromTabulations($event);
            $finalResults = $this->buildResultsFromTabulations($event);
            
            // Get medal tally information
            $medalTally = $event->medalTallies->first();
            $medalTallyName = $medalTally ? $medalTally->tally_title : null;
            
            return inertia('Public/ArchiveDetails', [
                'event' => $event,
                'archiveData' => $finalResults,
                'rankings' => $rankings,
                'archivedAt' => $event->updated_at,
                'notes' => null,
                'medalTallyName' => $medalTallyName
            ]);
        }

        $finalResults = json_decode($archive->final_results, true);
        $rankings = json_decode($archive->contestant_rankings, true);

        // Get medal tally information
        $medalTally = $event->medalTallies->first();
        $medalTallyName = $medalTally ? $medalTally->tally_title : null;

        return inertia('Public/ArchiveDetails', [
            'event' => $event,
            'archiveData' => $finalResults,
            'rankings' => $rankings,
            'archivedAt' => $archive->archived_at,
            'notes' => $archive->notes,
            'medalTallyName' => $medalTallyName
        ]);
    }

    // API endpoints for real-time data
    public function getMedalTallyData()
    {
        $tallies = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tallies);
    }

    private function calculateRankingsFromTabulations($event)
    {
        $rankings = [];
        
        foreach ($event->contestants as $contestant) {
            $totalScore = 0;
            $scoreCount = 0;

            $rounds = \App\Models\Round::where('contestant_id', $contestant->id)
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

            $rounds = \App\Models\Round::where('contestant_id', $contestant->id)
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
}
