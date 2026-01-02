<?php

namespace App\Http\Controllers\admin;

use App\Models\User;
use App\Models\Event;
use App\Models\Active;
use App\Models\Assign;
use App\Models\Criteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function showEvents(Request $request) {
        $perPage = $request->input('per_page', 10);
        $showPast = filter_var($request->input('show_past', false), FILTER_VALIDATE_BOOLEAN);
        $today = now()->startOfDay();

        $query = Event::query();

        // Filter by date: show events that start today or in the future
        if (!$showPast) {
            $query->where('event_start', '>=', $today);
        }

        // Order by event start date (newest first)
        $query->orderBy('event_start', 'desc');

        $events = $query->paginate($perPage);

        return response()->json($events);
    }

    public function createEvent(Request $request) {
        $validatedData = $request->validate([
            'event_name' => ['required', 'string', 'max:255'],
            'event_type' => ['required', 'string'],
            'description' => ['nullable', 'string', 'max:255'],
            'event_start' => ['required', 'date'],
            'event_end' => ['required', 'date', 'after:event_start'],
            'is_active' => ['required', 'integer', 'in:0,1'],
        ]);

        Event::create($validatedData);

        return redirect()->back()->with('success', 'Event added successfully!');
    }

    public function editEvent(Request $request, $id) {
        $validatedData = $request->validate([
            'event_name' => ['required', 'string', 'max:255'],
            'event_type' => ['required', 'string'],
            'description' => ['nullable', 'string', 'max:255'],
            'event_start' => ['required', 'date'],
            'event_end' => ['required', 'date', 'after:event_start'],
            'is_active' => ['required', 'integer', 'in:0,1'],
        ]);

        $eventData = Event::findOrFail($id);
        
        if ($validatedData['is_active'] == 0 && $eventData->is_active == 1) {
            $this->archiveEventData($eventData);
            $validatedData['is_archived'] = 1;
        } elseif ($validatedData['is_active'] == 1 && $eventData->is_archived == 1) {
            $validatedData['is_archived'] = 0;
        }
        
        $eventData->fill($validatedData);
        $eventData->save();
        
        return redirect()->back()->with('success', 'Event updated successfully!');
    }
    
    private function archiveEventData($event) {
        $event->load([
            'contestants',
            'criterias',
            'actives.rounds.tabulations.criteria',
            'actives.rounds.tabulations.user'
        ]);

        $archiveData = [
            'contestants' => [],
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

        $rankings = $this->calculateRankings($event);

        \App\Models\ResultArchive::updateOrCreate(
            ['event_id' => $event->id],
            [
                'final_results' => json_encode($archiveData),
                'contestant_rankings' => json_encode($rankings),
                'archived_at' => now()
            ]
        );
    }

    private function calculateRankings($event) {
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
    public function deleteEvent($id){
        $eventData = Event::findOrFail($id);
        $eventData->delete();
        return redirect()->back()->with('success', 'Event deleted successfully!');
    }

    public function showCriteria() {
        $criterias = Criteria::all();
        return response()->json($criterias);
    }

    public function createCriteria(Request $request) {
        $validatedData = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'criteria_desc' => ['required', 'string', 'max:255'],
            'definition' => ['nullable', 'string'],
            'percentage' => ['required', 'integer', 'min:0', 'max:100'],
            'valid_round' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'integer', 'in:0,1'],
        ]);

        $active = Active::firstOrCreate(
            [
                'event_id' => $validatedData['event_id'],
                'round_no' => $validatedData['valid_round']
            ],
            [
                'is_active' => 0
            ]
        );

        $criteria = Criteria::create([
            'event_id' => $validatedData['event_id'],
            'active_id' => $active->id,
            'criteria_desc' => $validatedData['criteria_desc'],
            'definition' => $validatedData['definition'],
            'percentage' => $validatedData['percentage'],
            'is_active' => $validatedData['is_active'],
            'valid_round' => $validatedData['valid_round'],
        ]);

        return redirect()->back()->with('success', 'Criteria added successfully!');
    }

    public function editCriteria(Request $request, $id) {
        $validatedData = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'criteria_desc' => ['required', 'string', 'max:255'],
            'definition' => ['nullable', 'string'],
            'percentage' => ['required', 'integer', 'min:0', 'max:100'],
            'valid_round' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'integer', 'in:0,1'],
        ]);
    
        $criteria = Criteria::findOrFail($id);
    
        if ($criteria->valid_round != $validatedData['valid_round']) {
            $active = Active::firstOrCreate(
                [
                    'event_id' => $validatedData['event_id'],
                    'round_no' => $validatedData['valid_round']
                ],
                [
                    'is_active' => 0
                ]
            );
            $criteria->active_id = $active->id;
        }
    
        $criteria->update([
            'event_id' => $validatedData['event_id'],
            'criteria_desc' => $validatedData['criteria_desc'],
            'definition' => $validatedData['definition'],
            'percentage' => $validatedData['percentage'],
            'is_active' => $validatedData['is_active'],
            'valid_round' => $validatedData['valid_round'],
        ]);
    
        return redirect()->back()->with('success', 'Criteria updated successfully!');
    }

    public function deleteCriteria($id) {
        $criteriaData = Criteria::findOrFail($id);

        $criteriaData->delete();
        return redirect()->back()->with('success', 'Criteria deleted successfully!');
    }
    public function getJudges(Request $request) {
        $eventId = $request->query('event_id');

        $judges = User::where('role_id', 2)
            ->where('is_active', 1);

        $judges = $judges->whereDoesntHave('assigns.event', function($query) {
            $query->where('is_active', 1)
                  ->where('is_archived', 0);
        });

        $judges = $judges->get();

        return response()->json([
            'judges' => $judges
        ]);
    }

    public function assignJudge(Request $request) {
        $validatedData = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'user_id' => ['required', 'array', 'min:1'],
            'user_id.*' => ['required', 'exists:users,id']
        ]);
    
        DB::beginTransaction();
        
        try {
            $eventId = $validatedData['event_id'];
            $judgeIds = $validatedData['user_id'];
    
    
            foreach ($judgeIds as $judgeId) {
                Assign::create([
                    'event_id' => $eventId,
                    'user_id' => $judgeId
                ]);
            }
    
            DB::commit();
    
            return redirect()->back()->with('success', 'Judges assigned successfully!');
    
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()->with('error', 'Failed to assign judges: ' . $e->getMessage());
        }
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
