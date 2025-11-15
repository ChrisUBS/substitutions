<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

class EmailController extends Controller
{
    public function verify(Request $request, $id, $hash) 
    {
        $user = User::findOrFail($id);

        // Validate the signature
        if (! URL::hasValidSignature($request)) {
            return redirect(env('APP_URL') . '/email-verified?status=expired');
        }

        // Verify the email hash
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return redirect(env('APP_URL') . '/email-verified?status=invalid');
        }

        // Mark email as verified if it is not already verified
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        // Redirect to frontend with success message
        return redirect(env('APP_URL') . '/email-verified?status=success');
    }

    public function resendVerificationEmail(Request $request) 
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification link sent!']);
    }

    public function sendResetPasswordLink(Request $request)
    {
        // Check if email is provided and valid
        $request->validate([
            'email' => 'required|email'
        ]);

        // Attempt to send the reset link
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset email sent successfully.'
            ], 200);
        }

        return response()->json([
            'message' => 'Email not found.'
        ], 404);
    }
}