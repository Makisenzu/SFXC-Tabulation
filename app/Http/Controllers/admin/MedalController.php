<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\MedalTally;
use App\Models\MedalTallyParticipant;
use App\Models\MedalScore;
use App\Models\Event;
use App\Events\MedalTallyUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedalController extends Controller
{
    public function getMedalTallies(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        
        $tallies = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        
        return response()->json($tallies);
    }

    public function getMedalTally($id)
    {
        $tally = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->findOrFail($id);
        
        return response()->json($tally);
    }

    public function createMedalTally(Request $request)
    {
        $validated = $request->validate([
            'tally_title' => 'required|string|max:255',
            'event_ids' => 'required|array|min:1',
            'event_ids.*' => 'exists:events,id',
            'participants' => 'required|array|min:1',
            'participants.*' => 'required|string|max:255'
        ]);

        DB::beginTransaction();
        try {
            $tally = MedalTally::create([
                'tally_title' => $validated['tally_title']
            ]);

            $tally->events()->attach($validated['event_ids']);

            foreach ($validated['participants'] as $participantName) {
                MedalTallyParticipant::create([
                    'medal_tally_id' => $tally->id,
                    'participant_name' => $participantName
                ]);
            }

            DB::commit();
            
            return response()->json([
                'message' => 'Medal Tally created successfully',
                'tally' => $tally->load(['events', 'participants'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create medal tally'], 500);
        }
    }

    public function updateScore(Request $request)
    {
        $validated = $request->validate([
            'medal_tally_id' => 'required|exists:medal_tallies,id',
            'event_id' => 'required|exists:events,id',
            'participant_id' => 'required|exists:medal_tally_participants,id',
            'score' => 'required|integer|min:1|max:3',
            'score_id' => 'nullable|exists:medal_scores,id'
        ]);

        $medalType = $this->convertScoreToMedal($validated['score']);

        if ($validated['score_id']) {
            // Update existing score
            $score = MedalScore::findOrFail($validated['score_id']);
            $score->update([
                'score' => $validated['score'],
                'medal_type' => $medalType
            ]);
        } else {
            // Create new score
            $score = MedalScore::create([
                'medal_tally_id' => $validated['medal_tally_id'],
                'event_id' => $validated['event_id'],
                'participant_id' => $validated['participant_id'],
                'score' => $validated['score'],
                'medal_type' => $medalType
            ]);
        }

        broadcast(new MedalTallyUpdated($validated['medal_tally_id']));

        return response()->json([
            'message' => 'Score updated successfully',
            'score' => $score,
            'medal_type' => $medalType
        ]);
    }

    public function deleteScore($id)
    {
        $score = MedalScore::findOrFail($id);
        $medalTallyId = $score->medal_tally_id;
        $score->delete();
        
        broadcast(new MedalTallyUpdated($medalTallyId));
        
        return response()->json([
            'message' => 'Score deleted successfully'
        ]);
    }

    public function deleteMedalTally($id)
    {
        $tally = MedalTally::findOrFail($id);
        $tally->delete();
        
        return response()->json([
            'message' => 'Medal Tally deleted successfully'
        ]);
    }

    public function printFullTally($id)
    {
        $tally = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->findOrFail($id);
        
        return inertia('Admin/PrintFullMedalTally', [
            'tally' => $tally
        ]);
    }

    public function printCueCards($id)
    {
        $tally = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->findOrFail($id);
        
        return inertia('Admin/PrintCueCards', [
            'tally' => $tally
        ]);
    }

    private function convertScoreToMedal($score)
    {
        switch ($score) {
            case 1:
                return 'Bronze';
            case 2:
                return 'Silver';
            case 3:
                return 'Gold';
            default:
                return '';
        }
    }
}
