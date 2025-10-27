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

    public function editContestant(Request $request, $id) {
        $contestant = Contestant::findOrFail($id);
        
        $validateData = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'contestant_name' => ['required', 'string', 'max:255'],
            'sequence_no' => [
                'required', 
                'integer',
                Rule::unique('contestants')->where(function ($query) use ($request) {
                    return $query->where('event_id', $request->event_id);
                })->ignore($contestant->id)
            ],
            'is_active' => ['required', 'in:0,1']
        ]);
    
        $contestant->update($validateData);
        return redirect()->back()->with('success', 'Contestant updated successfully!');
    }

    public function uploadPhoto(Request $request, $id) {
        $contestant = Contestant::findOrFail($id);
        
        $validateData = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048']
        ]);
    
        try {
            if ($contestant->photo) {
                $oldPhotoPath = storage_path('app/public/' . $contestant->photo);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }

            $photoPath = $request->file('photo')->store('contestants', 'public');
            $contestant->update(['photo' => $photoPath]);
            
            return redirect()->back()->with('success', 'Photo uploaded successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to upload photo: ' . $e->getMessage());
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
