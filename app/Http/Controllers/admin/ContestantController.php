<?php

namespace App\Http\Controllers\admin;

use App\Models\Contestant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;

class ContestantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function getContestants() {
        $contestants = Contestant::all();
        return response()->json($contestants);
    }

    public function createContestants(Request $request) {
        $validateData = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'contestant_name' => ['required', 'string', 'max:255'],
            'sequence_no' => [
                'required', 
                'integer',
                Rule::unique('contestants')->where(function ($query) use ($request) {
                    return $query->where('event_id', $request->event_id);
                })
            ],
            'is_active' => ['required', 'in:0,1']
        ]);
    
        Contestant::create($validateData);
        return redirect()->back()->with('success', 'Contestant added successfully!');
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
