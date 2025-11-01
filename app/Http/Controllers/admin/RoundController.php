<?php

namespace App\Http\Controllers\admin;

use App\Models\Event;
use App\Models\Round;
use App\Models\Active;
use App\Models\Criteria;
use App\Models\Contestant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoundController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function getEvents(){
        $events = Event::all();

        return response()->json($events);
    }

    public function getActiveRounds($id) {
        $activeRounds = Active::where('event_id', $id)->get();
        return response()->json($activeRounds);
    }

    public function addContestantRound(Request $request){
            $request->validate([
                'contestant_ids' => 'required|array',
                'contestant_ids.*' => 'exists:contestants,id',
                'round_no' => 'required|integer|min:1',
                'event_id' => 'required|exists:events,id'
            ]);
    
            $contestantIds = $request->contestant_ids;
            $roundNo = $request->round_no;
            $eventId = $request->event_id;
    
            $activeRound = Active::firstOrCreate([
                'event_id' => $eventId,
                'round_no' => $roundNo
            ], [
                'is_active' => false
            ]);
    
            $addedCount = 0;
            $existingCount = 0;
    
            foreach ($contestantIds as $contestantId) {
                $existingRound = Round::where('contestant_id', $contestantId)
                    ->where('active_id', $activeRound->id)
                    ->first();
    
                if (!$existingRound) {
                    Round::create([
                        'contestant_id' => $contestantId,
                        'active_id' => $activeRound->id
                    ]);
                    $addedCount++;
                } else {
                    $existingCount++;
                }
            }
    
            return redirect()->back()->with('success', 'Contestant added successfully!');
    }

    public function getRoundContestants($eventId, $roundNo){
            $activeRound = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();

            if (!$activeRound) {
                return response()->json([]);
            }
            $contestants = Contestant::whereHas('rounds', function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                })
                ->with(['event'])
                ->get();

            return response()->json($contestants);
    }

    public function deleteContestant($contestantId, Request $request){
            $request->validate([
                'round_no' => 'required|integer',
                'event_id' => 'required|exists:events,id'
            ]);
    
            $activeRound = Active::where('event_id', $request->event_id)
                ->where('round_no', $request->round_no)
                ->first();

            $deleted = Round::where('contestant_id', $contestantId)
                ->where('active_id', $activeRound->id)
                ->delete();
    
            if ($deleted) {
                return redirect()->back()->with('success', 'Contestant deleted successfully!');
            }
    }

    public function setActiveRound($eventId, Request $request){
            $request->validate([
                'round_no' => 'required|integer|min:1'
            ]);

            Active::where('event_id', $eventId)->update(['is_active' => 0]);
    
            $activeRound = Active::where('event_id', $eventId)
                ->where('round_no', $request->round_no)
                ->first();
    
            if ($activeRound) {
                $activeRound->update(['is_active' => 1]);
            } else {
                Active::create([
                    'event_id' => $eventId,
                    'round_no' => $request->round_no,
                    'is_active' => 1
                ]);
            }
    
            return redirect()->back()->with('success', 'Set as active round!');
    }

    public function populateTabulationCriteria($eventId, Request $request)
    {
        try {
            $request->validate([
                'round_no' => 'required|integer|min:1'
            ]);
    
            $roundNo = $request->round_no;
    
            $activeRound = Active::where('event_id', $eventId)
                ->where('round_no', $roundNo)
                ->first();
    
            if (!$activeRound) {
                return redirect()->back()->withErrors([
                    'message' => 'Active round not found'
                ]);
            }
    
            $contestants = Contestant::whereHas('rounds', function($query) use ($activeRound) {
                    $query->where('active_id', $activeRound->id);
                })
                ->with(['event'])
                ->get();
    
            $criteria = Criteria::where('active_id', $activeRound->id)
                ->where('is_active', 1)
                ->get();
    
            $judgeData = [
                'active_round' => [
                    'round_no' => $activeRound->round_no,
                    'event_name' => $activeRound->event->event_name ?? 'Unknown Event',
                    'is_active' => $activeRound->is_active
                ],
                'contestants' => $contestants->map(function($contestant) {
                    return [
                        'id' => $contestant->id,
                        'contestant_name' => $contestant->contestant_name,
                        'sequence_no' => $contestant->sequence_no,
                        'photo' => $contestant->photo,
                        'is_active' => $contestant->is_active
                    ];
                }),
                'criteria' => $criteria->map(function($criterion) {
                    return [
                        'id' => $criterion->id,
                        'criteria_desc' => $criterion->criteria_desc,
                        'definition' => $criterion->definition,
                        'percentage' => $criterion->percentage,
                        'max_percentage' => $criterion->max_percentage
                    ];
                }),
                'summary' => [
                    'total_contestants' => $contestants->count(),
                    'total_criteria' => $criteria->count(),
                    'total_percentage' => $criteria->sum('percentage')
                ]
            ];
    
            // For Inertia, use redirect back with data
            return redirect()->back()->with([
                'success' => true,
                'data' => $judgeData,
                'message' => 'Tabulation criteria populated successfully for judges'
            ]);
    
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'message' => 'Failed to populate tabulation criteria: ' . $e->getMessage()
            ]);
        }
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
