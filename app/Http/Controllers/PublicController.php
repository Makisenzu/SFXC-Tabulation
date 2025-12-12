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
        $event = Event::with('medalTallies')->findOrFail($eventId);

        // Check if result archive exists for this event
        $archive = ResultArchive::where('event_id', $eventId)
            ->latest()
            ->first();

        if (!$archive) {
            abort(404, 'Archive data not found for this event. Results may not have been generated yet.');
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
}
