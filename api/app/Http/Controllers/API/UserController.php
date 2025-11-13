<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SendTemporaryPassword;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $currentUser = auth()->user();
        
        // Load the role relationship if it is not loaded
        $currentUser->load('role');
        
        // Verify if it is admin
        if (!$currentUser->role || strtolower($currentUser->role->name) !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
        }

        $users = User::all();
        return response()->json(['users' => $users], 200);
    }

    public function store(Request $request)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $currentUser = auth()->user();
        
        // Load the role relationship if it is not loaded
        $currentUser->load('role');
        
        // Verify if it is admin
        if (!$currentUser->role || strtolower($currentUser->role->name) !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'salary' => 'nullable|numeric',
            'id_role' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Generate a temporary random password and create the user
        $tempPassword = Str::random(10);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($tempPassword),
            'salary' => $request->salary,
            'id_role' => $request->id_role,
        ]);

        // Send email with temporary password
        $user->notify(new SendTemporaryPassword($tempPassword));

        return response()->json(['user' => $user], 201);
    }

    public function show($id)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $currentUser = auth()->user();
        
        // Load the role relationship if it is not loaded
        $currentUser->load('role');
        
        // Verify if it is admin
        if (!$currentUser->role || strtolower($currentUser->role->name) !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
        }
        
        $user = User::findOrFail($id);
        return response()->json(['user' => $user], 200);
    }

    public function update(Request $request, $id)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $currentUser = auth()->user();
        
        // Load the role relationship if it is not loaded
        $currentUser->load('role');
        
        // Verify if it is admin
        if (!$currentUser->role || strtolower($currentUser->role->name) !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
        }

        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'salary' => 'sometimes|nullable|numeric',
            'id_role' => 'sometimes|required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user->update($request->all());

        return response()->json(['user' => $user], 200);
    }

    public function destroy($id)
    {
        // Check if the user is authenticated
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $currentUser = auth()->user();
        
        // Load the role relationship if it is not loaded
        $currentUser->load('role');
        
        // Verify if it is admin
        if (!$currentUser->role || strtolower($currentUser->role->name) !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
        }

        $user = User::findOrFail($id);

        // Prevent the admin from deleting themselves
        if ($currentUser->id == $user->id) {
            return response()->json(['error' => 'You cannot delete yourself'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}