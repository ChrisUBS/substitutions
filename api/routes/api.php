<?php

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use App\Models\User;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmailController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\ProgramController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\CohortController;
use App\Http\Controllers\API\RequestController;

// **** Public routes ****
// Health check
Route::get('/health', function () { return response()->json(['message' => 'API is healthy'], 200); });

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function() { return response()->json(['message' => 'Please login via API'], 401); })->name('login');
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Roles
Route::get('/roles', [RoleController::class, 'index']);

// **** Email verification routes ****
Route::get('/email/verify/{id}/{hash}', [EmailController::class, 'verify'])->middleware(['signed'])->name('verification.verify');
Route::post('/email/recovery-password', [EmailController::class, 'sendResetPasswordLink'])->name('password.email');
// Note: If you want only users with verified email to access certain routes, add the  'verified' middleware.

// **** Protected routes ****
Route::middleware(['cookie.auth', 'auth:sanctum'])->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Email
    Route::post('/email/verification-notification', [EmailController::class, 'resendVerificationEmail'])->name('verification.send');
    
    // Users
    Route::apiResource('users', UserController::class);
    Route::get('/users/role/{roleName}', [UserController::class, 'getUsersByRole']);
    Route::get('/users/{id}/requests', [UserController::class, 'getUserRequests']);

    // Programs
    Route::apiResource('programs', ProgramController::class);
    Route::get('/programs/{id}/courses', [ProgramController::class, 'getCourses']);
    Route::get('/programs/{id}/cohorts', [ProgramController::class, 'getCohorts']);

    // Courses
    Route::apiResource('courses', CourseController::class);

    // Cohorts
    Route::apiResource('cohorts', CohortController::class);
    Route::get('/cohorts/{id}/courses', [CohortController::class, 'getCourses']);
    Route::get('/cohorts/{id}/courses/{courseId}/discounts', [CohortController::class, 'getDiscountHistories']);
    
    // Requests
    Route::apiResource('requests', RequestController::class);

    // User profile
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });
});