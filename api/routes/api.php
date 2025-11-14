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

// **** Public routes ****
// Health check
Route::get('/health', function () { return response()->json(['message' => 'API is healthy'], 200); });

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function() { return response()->json(['message' => 'Please login via API'], 401); })->name('login');

// Roles
Route::get('/roles', [RoleController::class, 'index']);

// **** Email verification route ****
Route::get('/email/verify/{id}/{hash}', [EmailController::class, 'verify'])->middleware(['signed'])->name('verification.verify');
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
    
    // User profile
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });
});