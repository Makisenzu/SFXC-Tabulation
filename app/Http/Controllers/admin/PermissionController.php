<?php

namespace App\Http\Controllers\admin;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function getUser(){
        try {
            $users = User::with('role')->get();
            return response()->json([
                'success' => true,
                'message' => 'Retrieved data successfully',
                'users' => $users
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get users',
                'error' => $e->getMessage()
            ]); 
        }
    }

    public function addUser(Request $request) {
        try {
            $request->validate([
                'role_id' => ['required', 'exists:roles,id'],
                'username' => ['required', 'string', 'max:255', 'unique:users,username'],
                'password' => ['required', 'string', 'min:8'],
                'is_active' => ['required', 'in:0,1'],
            ]);

            $user = User::create([
                'role_id' => $request->role_id,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'is_active' => $request->is_active
            ]);

            return redirect()->back()->with('success', 'User added successfully!');
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add user',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function deleteUser(String $id) {
        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'User deleted successfully!');
    }

    public function updateUser(Request $request, String $id) {
        $data = $request->validate([
            'is_active' => ['required', 'in:0,1']
        ]);

        $userData = User::findOrFail($id);
        $userData->update($data);
        
        return redirect()->back()->with('success', 'Status updated successfully!');
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
