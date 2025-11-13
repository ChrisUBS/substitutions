<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class EmailController extends Controller
{
    public function verify(Request $request, $id, $hash) 
    {
        $user = User::findOrFail($id);

        // Validate the signature
        if (! URL::hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 403);
        }

        // Verify the email hash
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'Invalid verification hash.'], 403);
        }

        // Mark email as verified if it is not already verified
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        // return redirect('https://domain.com/email-verified');
        return response()->json(['message' => 'Email verified successfully!']);
    }

    public function resendVerificationEmail(Request $request) 
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification link sent!']);
    }
}