<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
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
            'monetary_value' => 'required|numeric',
            'id_program' => 'required|exists:programs,id',
            'id_instructor' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::create(
            $request->only(['name', 'monetary_value', 'id_program', 'id_instructor'])
        );
        return response()->json(['course' => $course], 201);
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

        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'monetary_value' => 'sometimes|required|numeric',
            'id_instructor' => 'sometimes|required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course->update($request->only(['name', 'monetary_value', 'id_instructor']));
        return response()->json(['course' => $course], 200);
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
        
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $course->delete();
        return response()->json(['message' => 'Course deleted successfully'], 200);
    }
}