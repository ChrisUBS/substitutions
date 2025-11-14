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
}