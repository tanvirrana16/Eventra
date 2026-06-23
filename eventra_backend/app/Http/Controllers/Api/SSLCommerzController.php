<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SSLCommerzController extends Controller
{
    /**
     * Initialize SSLCommerz checkout session and return hosted redirect link.
     */
    public function initiate(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Authorization required.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'event_id' => 'required|exists:events,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $event = Event::find($request->event_id);

        // Verify if user already has a registration
        $alreadyRegistered = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($alreadyRegistered) {
            if ($alreadyRegistered->payment_status === 'paid' || $alreadyRegistered->payment_status === 'free') {
                return response()->json(['message' => 'You are already registered for this event.'], 409);
            }
            // If it is a stale pending checkout, we reuse its transaction ID
            return response()->json([
                'gateway_url' => "http://localhost:5173/sslcommerz/hosted-checkout?tran_id=" . $alreadyRegistered->transaction_id
            ]);
        }

        // Check seat availability
        if ($event->seats_left <= 0) {
            return response()->json(['message' => 'Event is fully booked. No seats remaining.'], 422);
        }

        // Generate checkout parameters
        $transactionId = 'SSLC-TXN-' . strtoupper(Str::random(12));
        $registrationCode = 'REG-' . strtoupper(Str::random(8));
        $securityToken = 'SEC-' . Str::random(16);

        // Create a pending registration (we don't decrement seats yet; done upon successful payment callback)
        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'registration_code' => $registrationCode,
            'payment_method' => 'SSLCommerz',
            'payment_amount' => (float)$event->ticket_price,
            'payment_status' => 'pending',
            'security_token' => $securityToken,
            'pass_status' => 'Pending Payment',
            'registered_at' => now(),
            'transaction_id' => $transactionId,
        ]);

        return response()->json([
            'gateway_url' => "http://localhost:5173/sslcommerz/hosted-checkout?tran_id={$transactionId}"
        ], 201);
    }

    /**
     * Retrieve transaction details for the hosted payment page simulator.
     */
    public function details(Request $request)
    {
        $tranId = $request->query('tran_id');
        if (!$tranId) {
            return response()->json(['message' => 'Transaction ID is required.'], 422);
        }

        $registration = EventRegistration::with(['event', 'user'])->where('transaction_id', $tranId)->first();
        if (!$registration) {
            return response()->json(['message' => 'Transaction not found.'], 404);
        }

        return response()->json([
            'transaction_id' => $registration->transaction_id,
            'amount' => (float)$registration->payment_amount,
            'event_title' => $registration->event->title,
            'user_name' => $registration->user->name,
            'user_email' => $registration->user->email,
        ]);
    }

    /**
     * Handle success payment callback from SSLCommerz checkout.
     */
    public function success(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tran_id' => 'required',
            'payment_method' => 'required|in:Visa,MasterCard,bKash,Nagad,Rocket,Upay',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $registration = EventRegistration::where('transaction_id', $request->tran_id)->first();
        if (!$registration) {
            return response()->json(['message' => 'Transaction not found.'], 404);
        }

        // If already processed, return success
        if ($registration->payment_status === 'paid') {
            return response()->json([
                'status' => 'success',
                'redirect_url' => 'http://localhost:5173/dashboard?payment_status=success'
            ]);
        }

        $event = $registration->event;
        $user = $registration->user;

        // Double check seat availability in case it got booked while user was on checkout page
        if ($event->seats_left <= 0) {
            return response()->json(['message' => 'Event is fully booked. Seat could not be allocated.'], 422);
        }

        // Update registration status to Active and Paid
        $registration->update([
            'payment_status' => 'paid',
            'pass_status' => 'Active',
            'payment_method' => $request->payment_method,
            'payment_date' => now(),
        ]);

        $event->decrement('seats_left');

        // Create notification & activity log entry
        $user->notifications()->create([
            'type' => 'Registration Approved',
            'title' => 'Registration Confirmed',
            'message' => "Your payment of \${$registration->payment_amount} for event '{$event->title}' has been processed. Your pass is now active.",
        ]);

        $user->activities()->create([
            'action' => 'Registered for Event',
            'description' => "Successfully paid and registered for event '{$event->title}'.",
        ]);

        // Email Simulation dispatch log
        $instructions = !empty($event->rules) ? implode("\n - ", $event->rules) : "Follow organizer instructions.";
        $organizerName = $event->organizer?->name ?? 'Eventra Team';
        
        $emailContent = <<<EOT
=========================================
EMAIL SIMULATION DISPATCH (SSLCOMMERZ WEBHOOK SUCCESS)
To: {$user->email}
Subject: Registration Confirmation & Digital Pass: {$event->title}
-----------------------------------------
Hello {$user->name},

Your payment of \${$registration->payment_amount} via SSLCommerz ({$request->payment_method}) was successful!

Event Details:
- Date: {$event->event_date->format('l, F j, Y')}
- Time: {$event->event_time}
- Venue: {$event->location}
- Organizer: {$organizerName}

Pass Identification:
- Registration Code: {$registration->registration_code}
- Pass Status: Active
- Ticket Type: {$event->ticket_type} (Paid Amount: \${$registration->payment_amount})
- Transaction ID: {$registration->transaction_id}
- Transaction Date: {$registration->payment_date->toDateTimeString()}

QR Code Payload Metadata:
- Registration ID: {$registration->id}
- User ID: {$user->id}
- Event ID: {$event->id}
- Security Token: {$registration->security_token}
- Pass Verification URL: http://localhost:5173/pass/verify?reg_id={$registration->id}&token={$registration->security_token}

Event Instructions & Rules:
 - {$instructions}

Please present this email or the generated digital pass at the entrance gate. We look forward to seeing you there!

Best regards,
The Eventra Coordination Team
=========================================
EOT;

        Log::info($emailContent);

        return response()->json([
            'status' => 'success',
            'redirect_url' => 'http://localhost:5173/dashboard?payment_status=success'
        ]);
    }

    /**
     * Handle payment cancellation from SSLCommerz hosted checkout page.
     */
    public function cancel(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tran_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $registration = EventRegistration::where('transaction_id', $request->tran_id)->first();

        // If found and pending, delete registration so that user's hold is released and they can retry
        if ($registration && $registration->payment_status === 'pending') {
            $registration->delete();
        }

        return response()->json([
            'status' => 'cancelled',
            'redirect_url' => 'http://localhost:5173/dashboard?payment_status=cancelled'
        ]);
    }
}
