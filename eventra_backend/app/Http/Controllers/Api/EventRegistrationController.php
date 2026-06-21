<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EventRegistrationController extends Controller
{
    /**
     * Register a participant for an event.
     */
    public function register(Request $request, $eventId)
    {
        // 1. Authenticate user via bearer token
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Authorization token is required.'], 401);
        }

        $user = User::where('api_token', $token)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid or expired authorization token.'], 401);
        }

        // 2. Find event
        $event = Event::with('organizer')->find($eventId);
        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 444);
        }

        // Check if user is already registered for this event
        $alreadyRegistered = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->exists();
        if ($alreadyRegistered) {
            return response()->json(['message' => 'You are already registered for this event.'], 409);
        }

        // 3. Check seat availability
        if ($event->seats_left <= 0) {
            return response()->json(['message' => 'Event is fully booked. No seats remaining.'], 422);
        }

        // 4. Validate registration/payment fields
        $rules = [
            'payment_method' => 'nullable|string|in:Visa,MasterCard,bKash,Nagad',
            'payment_amount' => 'nullable|numeric|min:0',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $paymentMethod = null;
        $paymentAmount = 0.00;
        $paymentStatus = 'free';

        // Check paid event workflow
        if ($event->ticket_type === 'paid') {
            if (!$request->filled('payment_method')) {
                return response()->json(['message' => 'Payment method is required for paid events.'], 422);
            }
            if ((float) $request->payment_amount < (float) $event->ticket_price) {
                return response()->json(['message' => 'Payment amount does not match event price.'], 422);
            }

            $paymentMethod = $request->payment_method;
            $paymentAmount = (float) $event->ticket_price;
            $paymentStatus = 'paid';
        }

        // 5. Generate secure registration credentials
        $registrationCode = 'REG-' . strtoupper(Str::random(8));
        $securityToken = 'SEC-' . Str::random(16);

        // 6. Save registration and update seats
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'registration_code' => $registrationCode,
            'payment_method' => $paymentMethod,
            'payment_amount' => $paymentAmount,
            'payment_status' => $paymentStatus,
            'security_token' => $securityToken,
            'pass_status' => 'Active',
            'registered_at' => now(),
        ]);

        $event->decrement('seats_left');

        // 7. Write to Log to simulate automatic email delivery
        $emailSubject = "Registration Confirmation & Digital Pass: {$event->title}";
        $instructions = !empty($event->rules) ? implode("\n - ", $event->rules) : "Follow organizer instructions.";
        $organizerName = $event->organizer?->name ?? 'Eventra Team';
        
        $emailContent = <<<EOT
=========================================
EMAIL SIMULATION DISPATCH
To: {$user->email}
Subject: {$emailSubject}
-----------------------------------------
Hello {$user->name},

Your registration for "{$event->title}" was successful!

Event Details:
- Date: {$event->event_date->format('l, F j, Y')}
- Time: {$event->event_time}
- Venue: {$event->location}
- Organizer: {$organizerName}

Pass Identification:
- Registration Code: {$registrationCode}
- Pass Status: Active
- Ticket Type: {$event->ticket_type} (Paid Amount: \${$paymentAmount})

QR Code Payload Metadata:
- Registration ID: {$registration->id}
- User ID: {$user->id}
- Event ID: {$event->id}
- Security Token: {$securityToken}

Event Instructions & Rules:
 - {$instructions}

Please present this email or the generated digital pass at the entrance gate. We look forward to seeing you there!

Best regards,
The Eventra Coordination Team
=========================================
EOT;

        Log::info($emailContent);

        // 8. Return response payload matching frontend pass rendering
        return response()->json([
            'message' => 'Registration successful.',
            'registration' => [
                'id' => $registration->id,
                'registration_code' => $registrationCode,
                'registered_at' => $registration->registered_at,
                'pass_status' => 'Active',
                'payment_method' => $paymentMethod,
                'payment_amount' => $paymentAmount,
                'payment_status' => $paymentStatus,
                'security_token' => $securityToken,
            ],
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'dateText' => $event->event_date->format('l, F j, Y'),
                'time' => date('h:i A', strtotime($event->event_time)),
                'venue' => $event->location,
                'organizer_name' => $event->organizer?->name ?? 'Eventra Team',
                'ticket_type' => $event->ticket_type,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'qr_data' => "reg_id={$registration->id}&user_id={$user->id}&event_id={$event->id}&token={$securityToken}"
        ], 201);
    }
}
