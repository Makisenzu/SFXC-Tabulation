<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Medal;
use App\Models\Event;
use App\Models\Contestant;
use Illuminate\Http\Request;

class MedalController extends Controller
{
    public function getMedals()
    {
        $medals = Medal::with(['event', 'contestant'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($medals);
    }

    public function getMedalsByEvent($eventId)
    {
        $medals = Medal::with('contestant')
            ->where('event_id', $eventId)
            ->orderBy('rank', 'asc')
            ->get();
        
        return response()->json($medals);
    }

    public function createMedal(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'contestant_id' => 'required|exists:contestants,id',
            'medal_type' => 'required|in:Gold,Silver,Bronze',
            'rank' => 'required|integer|min:1'
        ]);

        $medal = Medal::create($validated);
        
        return response()->json([
            'message' => 'Medal awarded successfully',
            'medal' => $medal->load(['event', 'contestant'])
        ], 201);
    }

    public function updateMedal(Request $request, $id)
    {
        $medal = Medal::findOrFail($id);
        
        $validated = $request->validate([
            'medal_type' => 'sometimes|in:Gold,Silver,Bronze',
            'rank' => 'sometimes|integer|min:1'
        ]);

        $medal->update($validated);
        
        return response()->json([
            'message' => 'Medal updated successfully',
            'medal' => $medal->load(['event', 'contestant'])
        ]);
    }

    public function deleteMedal($id)
    {
        $medal = Medal::findOrFail($id);
        $medal->delete();
        
        return response()->json([
            'message' => 'Medal deleted successfully'
        ]);
    }
}
