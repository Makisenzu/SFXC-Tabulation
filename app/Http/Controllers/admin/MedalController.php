<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\MedalTally;
use App\Models\MedalTallyParticipant;
use App\Models\MedalScore;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedalController extends Controller
{
    public function getMedalTallies()
    {
        $tallies = MedalTally::with(['events', 'participants', 'scores.event', 'scores.participant'])
            ->orderBy('created_at', 'desc')
            ->get();
        
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
            'score' => 'required|integer|min:1|max:3'
        ]);

        $medalType = $this->convertScoreToMedal($validated['score']);

        $score = MedalScore::updateOrCreate(
            [
                'medal_tally_id' => $validated['medal_tally_id'],
                'event_id' => $validated['event_id'],
                'participant_id' => $validated['participant_id']
            ],
            [
                'score' => $validated['score'],
                'medal_type' => $medalType
            ]
        );

        return response()->json([
            'message' => 'Score updated successfully',
            'score' => $score,
            'medal_type' => $medalType
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
