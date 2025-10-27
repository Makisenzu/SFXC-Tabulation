<?php

namespace App\Http\Controllers\admin;

use App\Models\Event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Criteria;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function showEvents() {
        $events = Event::all();

        return response()->json($events);
    }

    public function createEvent(Request $request) {
        $validatedData = $request->validate([
            'event_name' => ['required', 'string', 'max:255'],
            'event_type' => ['required', 'string', 'in:Pageant,Singing,Dancing'],
            'description' => ['required', 'string', 'max:255'],
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
            'event_type' => ['required', 'string', 'in:Pageant,Singing,Dancing'],
            'description' => ['required', 'string', 'max:255'],
            'event_start' => ['required', 'date'],
            'event_end' => ['required', 'date', 'after:event_start'],
            'is_active' => ['required', 'integer', 'in:0,1'],
        ]);

        $eventData = Event::findOrFail($id);
        $eventData->update($validatedData);
        return redirect()->back()->with('success', 'Event updated successfully!');
    }

    public function showCriteria() {
        $criterias = Criteria::all();
        return response()->json($criterias);
    }

    public function createCriteria(Request $request) {
        $validatedData = $request->validate([
            ''
        ]);
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
