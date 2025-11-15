<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\User;
use App\Models\Course;
use App\Models\Cohort;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::all();
        return response()->json($programs, 200);
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
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program = Program::create($request->only(['name']));
        return response()->json($program, 201);
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

        $program = Program::find($id);
        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program->update($request->only(['name']));
        return response()->json($program, 200);
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

        $program = Program::find($id);
        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        $program->delete();
        return response()->json(['message' => 'Program deleted successfully'], 200);
    }

    public function getCourses($id)
    {
        $program = Program::find($id);
        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }
        $courses = Course::where('id_program', $id)->get();
        return response()->json($courses, 200);
    }

    public function getCohorts($id)
    {
        $program = Program::find($id);
        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }
        $cohorts = Cohort::where('id_program', $id)->get();
        return response()->json($cohorts, 200);
    }
}