<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Request as UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestController extends Controller
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

        $requests = UserRequest::all();
        return response()->json(['requests' => $requests], 200);
    }

    public function show($id)
    {
        $request = UserRequest::find($id);
        if (!$request) {
            return response()->json(['error' => 'Request not found'], 404);
        }
        return response()->json(['request' => $request], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'nullable|string|in:paid,in process,pending payment,rejected',
            'session' => 'required|string',
            'absence_details' => 'required|json',
            'lesson_plan' => 'nullable|string',
            'activities_and_assignments' => 'nullable|json',
            'materials_needed' => 'nullable|json',
            'special_instructions' => 'nullable|string',
            'substitute_observations' => 'nullable|string',
            'request_manager_observations' => 'nullable|string',
            'id_substitute' => 'required|exists:users,id',
            'id_cohort_course' => 'required|exists:cohort_courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newRequest = UserRequest::create($request->all());
        return response()->json(['request' => $newRequest], 201);
    }

    public function update(Request $request, $id)
    {
        $existingRequest = UserRequest::find($id);
        if (!$existingRequest) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'nullable|string|in:paid,in process,pending payment,rejected',
            'session' => 'sometimes|required|string',
            'absence_details' => 'sometimes|required|json',
            'lesson_plan' => 'nullable|string',
            'activities_and_assignments' => 'nullable|json',
            'materials_needed' => 'nullable|json',
            'special_instructions' => 'nullable|string',
            'substitute_observations' => 'nullable|string',
            'request_manager_observations' => 'nullable|string',
            'id_substitute' => 'sometimes|required|exists:users,id',
            'id_cohort_course' => 'sometimes|required|exists:cohort_courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existingRequest->update($request->all());
        return response()->json(['request' => $existingRequest], 200);
    }
}