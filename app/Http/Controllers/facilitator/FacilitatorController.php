<?php

namespace App\Http\Controllers\facilitator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MedalTally;
use App\Models\MedalScore;
use App\Models\MedalTallyParticipant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FacilitatorController extends Controller
{
    public function getMedalTallies()
    {
        try {
            Log::info('Facilitator getMedalTallies called');
            
            $tallies = MedalTally::with(['events', 'participants'])
                ->get();

            Log::info('Tallies found', ['count' => $tallies->count()]);

            $talliesWithScores = $tallies->map(function ($tally) {
                $scores = MedalScore::where('medal_tally_id', $tally->id)->get();
                $tally->scores = $scores;
                return $tally;
            });

            return response()->json($talliesWithScores);
        } catch (\Exception $e) {
            Log::error('Error in getMedalTallies', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Failed to fetch medal tallies'
            ], 500);
        }
    }

    public function updateMedalScore(Request $request)
    {
        try {
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
        } catch (\Exception $e) {
            Log::error('Error updating medal score', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
