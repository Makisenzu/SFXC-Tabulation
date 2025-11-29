<?php

namespace App\Http\Controllers\facilitator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MedalTally;
use App\Models\MedalScore;
use App\Models\MedalTallyParticipant;
use Illuminate\Support\Facades\Auth;

class FacilitatorController extends Controller
{
    public function getMedalTallies()
    {
        $tallies = MedalTally::with(['events', 'participants'])
            ->where('is_active', 1)
            ->get();

        $talliesWithScores = $tallies->map(function ($tally) {
            $scores = MedalScore::where('medal_tally_id', $tally->id)->get();
            $tally->scores = $scores;
            return $tally;
        });

        return response()->json($talliesWithScores);
    }

    public function updateMedalScore(Request $request)
    {
        $request->validate([
            'medal_tally_id' => 'required|exists:medal_tallies,id',
            'event_id' => 'required|exists:events,id',
            'participant_id' => 'required|exists:medal_tally_participants,id',
            'score' => 'required|integer|min:0|max:3',
        ]);

        $score = MedalScore::updateOrCreate(
            [
                'medal_tally_id' => $request->medal_tally_id,
                'event_id' => $request->event_id,
                'participant_id' => $request->participant_id,
            ],
            [
                'score' => $request->score,
            ]
        );

        broadcast(new \App\Events\MedalTallyUpdated($request->medal_tally_id))->toOthers();

        return response()->json([
            'success' => true,
            'score' => $score,
            'message' => 'Score updated successfully'
        ]);
    }
}
