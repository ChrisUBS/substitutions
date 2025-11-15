<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\CohortCourse;
use App\Models\DiscountHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CohortController extends Controller
{
    // Create a new cohort
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
            'cohort_number' => 'required|numeric',
            'id_program' => 'required|exists:programs,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cohort = Cohort::create([
            'cohort_number' => $request->cohort_number,
            'id_program' => $request->id_program,
        ]);
        return response()->json($cohort, 201);
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

        $cohort = Cohort::find($id);
        if (!$cohort) {
            return response()->json(['error' => 'Cohort not found'], 404);
        }

        $cohort->delete();
        return response()->json(['message' => 'Cohort deleted successfully'], 200);
    }

    public function getCourses($id)
    {
        $cohort = Cohort::find($id);
        if (!$cohort) {
            return response()->json(['error' => 'Cohort not found'], 404);
        }

        $courses = CohortCourse::where('id_cohort', $id)->get();
        return response()->json($courses, 200);
    }

    public function getDiscountHistories($id, $courseId)
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

        // Verify if the cohort exists
        $cohort = Cohort::find($id);
        if (!$cohort) {
            return response()->json(['error' => 'Cohort not found'], 404);
        }

        // Verify if the course is associated with the cohort
        $cohortCourse = CohortCourse::where('id_cohort', $id)
            ->where('id_course', $courseId)
            ->first();
        if (!$cohortCourse) {
            return response()->json(['error' => 'Cohort course not found'], 404);
        }

        // Get discount histories for the cohort's course
        $discountHistories = DiscountHistory::where('id_cohort_course', $cohortCourse->id)->get();
        return response()->json($discountHistories, 200);
    }
}