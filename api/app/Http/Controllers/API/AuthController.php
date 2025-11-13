<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate input data
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Attempt to authenticate the user
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials',
            ], 401);
        }

        // Retrieve authenticated user
        $user = User::where('email', $request->email)->firstOrFail();

        // Check email verification
        if (!$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
            return response()->json([
                'message' => 'Please verify your email before logging in. A new verification email has been sent.',
                'require_email_verification' => true,
            ], 403);
        }

        // Create Sanctum token and cookie
        $token = $user->createToken('auth_token')->plainTextToken;
        $cookie = cookie(
            'token',                                    // Cookie name
            $token,                                     // Value (the token)
            60 * 24 * 7,                                // Duration: 7 days in minutes
            '/',                                        // Path: available throughout the domain
            null,                                       // Domain: null uses the current domain
            config('app.env') === 'production',         // Secure: only https in production
            true,                                       // HttpOnly: not accessible from JavaScript
            false,                                      // Raw: do not encrypt the cookie
            'Strict'                                    // SameSite: strict CSRF policy
        );

        // Check if user must change password
        if ($user->must_change_password) {
            return response()->json([
                'message' => 'You must change your password before continuing.',
                'user' => $user->only(['id', 'name', 'email', 'id_role']),
                'require_password_change' => true,
            ], 403) ->withCookie($cookie);
        } else {
            // Proceed to normal login response
            return response()->json([
                'message' => 'Login successful',
                'user' => $user->only(['id', 'name', 'email', 'id_role']),
            ])->withCookie($cookie);
        }
    }

    public function logout(Request $request)
    {
        // Validate that the user is authenticated and has a token to delete
        $request->user()->currentAccessToken()->delete();

        // Return a success response
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        // Validate input
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed', // requires new_password_confirmation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 403);
        }

        // Update password and remove the "must change" flag
        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,
        ]);

        // Revoke old tokens (forces re-login)
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password changed successfully. Please log in again.',
        ], 200);
    }
}