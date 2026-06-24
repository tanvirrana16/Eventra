<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EventRegistration;
use App\Models\Certificate;
use App\Models\Notification;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserDashboardController extends Controller
{
    /**
     * Get dashboard stats, recent activities, and upcoming event reminders.
     */
    public function dashboard()
    {
        $user = Auth::user();

        // Seed initial notifications if they are empty
        if ($user->notifications()->count() === 0) {
            $user->notifications()->createMany([
                [
                    'type' => 'Registration Approved',
                    'title' => 'Registration Confirmed',
                    'message' => 'Your registration for the upcoming Tech Innovation Summit has been approved! We look forward to seeing you.',
                    'created_at' => now()->subHours(2),
                ],
                [
                    'type' => 'Event Reminder',
                    'title' => 'Event Starting Tomorrow',
                    'message' => 'Reminder: The UI/UX Masterclass starts tomorrow at 10:00 AM. Please make sure to check in using your QR pass.',
                    'created_at' => now()->subDay(),
                ],
                [
                    'type' => 'Certificate Generated',
                    'title' => 'Certificate Issued',
                    'message' => 'Congratulations! Your certificate for the React Advanced Workshop has been generated. You can now download it.',
                    'created_at' => now()->subDays(3),
                ],
                [
                    'type' => 'New Event Recommendation',
                    'title' => 'New Event Just for You',
                    'message' => 'Based on your interests, we recommend checking out the Global Music Fest happening next month.',
                    'created_at' => now()->subDays(5),
                ],
            ]);
        }

        // Seed initial activities if they are empty
        if ($user->activities()->count() === 0) {
            $user->activities()->createMany([
                [
                    'action' => 'Registered for Event',
                    'description' => 'Registered for Tech Innovation Summit.',
                    'created_at' => now()->subHours(2),
                ],
                [
                    'action' => 'Updated Profile',
                    'description' => 'Updated address and occupation information.',
                    'created_at' => now()->subHours(5),
                ],
                [
                    'action' => 'Viewed Event Pass',
                    'description' => 'Viewed digital event pass for UI/UX Masterclass.',
                    'created_at' => now()->subDay(),
                ],
                [
                    'action' => 'Downloaded Certificate',
                    'description' => 'Downloaded completion certificate for React Advanced Workshop.',
                    'created_at' => now()->subDays(3),
                ],
            ]);
        }

        // Stats calculation
        $totalRegistrations = $user->registrations()->count();
        $upcomingEvents = $user->registrations()
            ->where('pass_status', '!=', 'Cancelled')
            ->whereHas('event', function ($q) {
                $q->where('event_date', '>=', now()->toDateString());
            })->count();
        $eventPasses = $user->registrations()->where('pass_status', 'Active')->count();
        $certificatesEarned = $user->certificates()->count();

        // Recent activities
        $recentActivities = $user->activities()
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Dynamic event reminders
        $upcomingRegs = $user->registrations()->with('event')
            ->where('pass_status', '!=', 'Cancelled')
            ->whereHas('event', function ($q) {
                $q->where('event_date', '>=', now()->toDateString());
            })->get();

        $reminders = [];
        foreach ($upcomingRegs as $reg) {
            $eventDate = \Carbon\Carbon::parse($reg->event->event_date);
            $diffInDays = now()->startOfDay()->diffInDays($eventDate->startOfDay(), false);

            if ($diffInDays === 0) {
                $reminders[] = [
                    'id' => $reg->id,
                    'event_title' => $reg->event->title,
                    'message' => "Your event '{$reg->event->title}' begins today!",
                    'days_left' => 0
                ];
            } elseif ($diffInDays === 1) {
                $reminders[] = [
                    'id' => $reg->id,
                    'event_title' => $reg->event->title,
                    'message' => "Your workshop begins tomorrow.",
                    'days_left' => 1
                ];
            } elseif ($diffInDays > 1 && $diffInDays <= 3) {
                $reminders[] = [
                    'id' => $reg->id,
                    'event_title' => $reg->event->title,
                    'message' => "Your event starts in {$diffInDays} days.",
                    'days_left' => $diffInDays
                ];
            }
        }

        return response()->json([
            'stats' => [
                'total_registrations' => $totalRegistrations,
                'upcoming_events' => $upcomingEvents,
                'event_passes' => $eventPasses,
                'certificates_earned' => $certificatesEarned,
            ],
            'recent_activities' => $recentActivities,
            'reminders' => $reminders,
        ]);
    }

    /**
     * Get user profile details.
     */
    public function profile()
    {
        $user = Auth::user();
        return response()->json($user);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        // Normalize camelCase fields from frontend
        if ($request->has('organizationName')) {
            $request->merge(['organization_name' => $request->organizationName]);
        }
        if ($request->has('contactInfo')) {
            $request->merge(['contact_info' => $request->contactInfo]);
        }
        if ($request->has('dateOfBirth')) {
            $request->merge(['date_of_birth' => $request->dateOfBirth]);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'occupation' => 'nullable|string|max:100',
            'organization_name' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|string', // supports base64 string
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'name', 'phone', 'date_of_birth', 'gender', 'occupation',
            'organization_name', 'address'
        ]);

        // Process profile photo base64 payload
        if ($request->filled('profile_photo')) {
            $photoData = $request->profile_photo;
            if ($photoData === 'remove') {
                // Delete existing local photo if exists
                if ($user->profile_photo && str_contains($user->profile_photo, 'profile_photos')) {
                    $fileName = basename($user->profile_photo);
                    $filePath = public_path('storage/profile_photos/' . $fileName);
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                }
                $data['profile_photo'] = null;
            } elseif (str_starts_with($photoData, 'data:image')) {
                // Delete old local photo if replacing
                if ($user->profile_photo && str_contains($user->profile_photo, 'profile_photos')) {
                    $fileName = basename($user->profile_photo);
                    $filePath = public_path('storage/profile_photos/' . $fileName);
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                }

                // Decode and store image in public/profile_photos directory
                $extension = explode('/', explode(':', substr($photoData, 0, strpos($photoData, ';')))[1])[1];
                $replace = substr($photoData, 0, strpos($photoData, ',') + 1);
                $image = str_replace($replace, '', $photoData);
                $image = str_replace(' ', '+', $image);
                $imageName = 'profile_' . $user->id . '_' . time() . '.' . $extension;
                
                $dirPath = public_path('storage/profile_photos');
                if (!file_exists($dirPath)) {
                    mkdir($dirPath, 0755, true);
                }
                
                file_put_contents($dirPath . '/' . $imageName, base64_decode($image));
                $data['profile_photo'] = asset('storage/profile_photos/' . $imageName);
            } else {
                $data['profile_photo'] = $photoData;
            }
        }

        $user->update($data);

        // Log Profile Update Activity
        $user->activities()->create([
            'action' => 'Updated Profile',
            'description' => 'Successfully updated profile information.',
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Get user event registrations.
     */
    public function registrations(Request $request)
    {
        $user = Auth::user();
        $registrations = $user->registrations()->with(['event.category', 'event.organizer'])->get();

        $formatted = $registrations->map(function ($reg) {
            $event = $reg->event;
            
            // Format dates
            $date = \Carbon\Carbon::parse($event->event_date);
            $day = $date->format('d');
            $month = strtoupper($date->format('M'));

            // Dynamically calculate status matching frontend EventCard logic
            $now = now();
            $startStr = $event->event_date->format('Y-m-d') . ' ' . $event->event_time;
            $start = \Carbon\Carbon::parse($startStr);

            if ($event->event_end_date && $event->event_end_time) {
                $endStr = $event->event_end_date->format('Y-m-d') . ' ' . $event->event_end_time;
                $end = \Carbon\Carbon::parse($endStr);
            } else {
                $end = (clone $start)->addHours(3);
            }

            if ($now->lt($start)) {
                $status = 'Upcoming';
            } elseif ($now->between($start, $end)) {
                $status = 'Live';
            } else {
                $status = 'Past';
            }

            return [
                'id' => $reg->id,
                'registration_code' => $reg->registration_code,
                'registered_at' => $reg->registered_at ? \Carbon\Carbon::parse($reg->registered_at)->format('Y-m-d H:i') : null,
                'payment_method' => $reg->payment_method,
                'payment_amount' => (float)$reg->payment_amount,
                'payment_status' => $reg->payment_status,
                'security_token' => $reg->security_token,
                'pass_status' => $reg->pass_status,
                'event' => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'slug' => $event->slug,
                    'category' => $event->category->name,
                    'dateBadge' => ['day' => $day, 'month' => $month],
                    'dateText' => $date->format('l, F j, Y'),
                    'time' => date('h:i A', strtotime($event->event_time)),
                    'venue' => $event->location,
                    'image' => $event->image_path,
                    'seatsLeft' => (int) $event->seats_left,
                    'totalSeats' => (int) $event->total_seats,
                    'ticketType' => $event->ticket_type,
                    'ticketPrice' => (float) $event->ticket_price,
                    'organizer' => [
                        'name' => $event->organizer?->name ?? 'Eventra Team',
                        'organization_name' => $event->organizer?->organization_name,
                    ],
                    'gallery' => $event->gallery ?? [],
                    'speakers' => $event->speakers ?? [],
                    'tags' => $event->tags ?? [],
                    'rules' => $event->rules ?? [],
                    'description' => $event->description,
                    'status' => $status,
                ],
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Get generated passes.
     */
    public function passes()
    {
        $user = Auth::user();
        $registrations = $user->registrations()->with('event.organizer')->get();

        $passes = $registrations->map(function ($reg) {
            $event = $reg->event;
            $qrData = "http://localhost:5173/pass/verify?reg_id={$reg->id}&token={$reg->security_token}";
            $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($qrData);

            return [
                'registration_id' => $reg->id,
                'registration_code' => $reg->registration_code,
                'event_name' => $event->title,
                'event_date' => \Carbon\Carbon::parse($event->event_date)->format('l, F j, Y'),
                'event_time' => date('h:i A', strtotime($event->event_time)),
                'venue' => $event->location,
                'organizer' => $event->organizer?->name ?? 'Eventra Team',
                'participant_name' => $reg->user->name ?? Auth::user()->name,
                'ticket_type' => $event->ticket_type,
                'payment_amount' => (float)$reg->payment_amount,
                'pass_status' => $reg->pass_status,
                'qr_code_url' => $qrUrl,
                'qr_data' => $qrData,
                'verification_number' => $reg->security_token,
            ];
        });

        return response()->json($passes);
    }

    /**
     * Get payment history (transactions list) for participant.
     */
    public function payments()
    {
        $user = Auth::user();
        $registrations = $user->registrations()
            ->with('event')
            ->whereNotNull('payment_method')
            ->orderBy('registered_at', 'desc')
            ->get();

        $formatted = $registrations->map(function ($reg) {
            return [
                'id' => $reg->id,
                'registration_code' => $reg->registration_code,
                'event_title' => $reg->event->title ?? 'N/A',
                'payment_method' => $reg->payment_method,
                'payment_amount' => (float)$reg->payment_amount,
                'payment_status' => $reg->payment_status,
                'transaction_id' => $reg->transaction_id ?? 'N/A',
                'payment_date' => $reg->payment_date ? $reg->payment_date->format('Y-m-d H:i') : ($reg->registered_at ? $reg->registered_at->format('Y-m-d H:i') : 'N/A')
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Get user certificates.
     */
    public function certificates()
    {
        $user = Auth::user();

        // Seed initial certificate if the user has completed at least one past registration and certificates table is empty
        if ($user->certificates()->count() === 0) {
            $pastRegistration = $user->registrations()
                ->whereHas('event', function ($q) {
                    $q->where('event_date', '<', now()->toDateString());
                })->first();

            if ($pastRegistration) {
                Certificate::create([
                    'event_id' => $pastRegistration->event_id,
                    'user_id' => $user->id,
                    'certificate_code' => 'CERT-' . strtoupper(Str::random(12)),
                    'issued_at' => now()->subDays(3),
                ]);
            }
        }

        $certificates = $user->certificates()->with(['event.organizer'])->get();

        $formatted = $certificates->map(function ($cert) {
            $event = $cert->event;
            $configJson = \App\Models\Setting::getValue("certificate_config_event_{$event->id}");
            $config = $configJson ? json_decode($configJson, true) : null;

            return [
                'id' => $cert->id,
                'event_name' => $event->title,
                'certificate_code' => $cert->certificate_code,
                'issue_date' => $cert->issued_at ? $cert->issued_at->format('Y-m-d') : null,
                'issue_date_text' => $cert->issued_at ? $cert->issued_at->format('F j, Y') : null,
                'status' => 'Issued',
                'organizer' => $config['president_name'] ?? $event->organizer?->name ?? 'Representative',
                'organization_name' => $config['organization_name'] ?? $event->organizer?->organization_name ?? 'Eventra Platform',
                'supported_by' => $config['supported_by'] ?? 'Supported by Eventra',
                'description' => $config['description'] ?? '',
                'president_name' => $config['president_name'] ?? $event->organizer?->name ?? 'Representative',
                'president_title' => $config['president_title'] ?? 'Director',
                'chairman_name' => $config['chairman_name'] ?? 'John Doe',
                'chairman_title' => $config['chairman_title'] ?? 'Chairman of Eventra',
                'theme' => $config['theme'] ?? 'dark-emerald',
                'participant_name' => Auth::user()->name,
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Get user notifications.
     */
    public function notifications()
    {
        $user = Auth::user();

        // Seed initial notifications if they are empty
        if ($user->notifications()->count() === 0) {
            $user->notifications()->createMany([
                [
                    'type' => 'Registration Approved',
                    'title' => 'Registration Confirmed',
                    'message' => 'Your registration for the upcoming Tech Innovation Summit has been approved! We look forward to seeing you.',
                    'created_at' => now()->subHours(2),
                ],
                [
                    'type' => 'Event Reminder',
                    'title' => 'Event Starting Tomorrow',
                    'message' => 'Reminder: The UI/UX Masterclass starts tomorrow at 10:00 AM. Please make sure to check in using your QR pass.',
                    'created_at' => now()->subDay(),
                ],
                [
                    'type' => 'Certificate Generated',
                    'title' => 'Certificate Issued',
                    'message' => 'Congratulations! Your certificate for the React Advanced Workshop has been generated. You can now download it.',
                    'created_at' => now()->subDays(3),
                ],
                [
                    'type' => 'New Event Recommendation',
                    'title' => 'New Event Just for You',
                    'message' => 'Based on your interests, we recommend checking out the Global Music Fest happening next month.',
                    'created_at' => now()->subDays(5),
                ],
            ]);
        }

        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        return response()->json($notifications);
    }

    /**
     * Mark single notification as read.
     */
    public function markRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found.'], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead()
    {
        $user = Auth::user();
        $user->notifications()->update(['is_read' => true]);
        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Delete notification.
     */
    public function deleteNotification($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found.'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted.']);
    }

    /**
     * Update user settings.
     */
    public function updateSettings(Request $request)
    {
        $user = Auth::user();

        // Normalize camelCase fields from frontend
        if ($request->has('twoFactorEnabled')) {
            $request->merge(['two_factor_enabled' => $request->twoFactorEnabled]);
        }
        if ($request->has('emailNotifications')) {
            $request->merge(['email_notifications' => $request->emailNotifications]);
        }
        if ($request->has('smsNotifications')) {
            $request->merge(['sms_notifications' => $request->smsNotifications]);
        }
        if ($request->has('eventRecommendations')) {
            $request->merge(['event_recommendations' => $request->eventRecommendations]);
        }

        $validator = Validator::make($request->all(), [
            'two_factor_enabled' => 'nullable|boolean',
            'email_notifications' => 'nullable|boolean',
            'sms_notifications' => 'nullable|boolean',
            'event_recommendations' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only([
            'two_factor_enabled', 'email_notifications', 'sms_notifications', 'event_recommendations'
        ]));

        $user->activities()->create([
            'action' => 'Updated Settings',
            'description' => 'Updated privacy and notification configurations.',
        ]);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        // Normalize camelCase fields
        if ($request->has('currentPassword')) {
            $request->merge(['current_password' => $request->currentPassword]);
        }
        if ($request->has('newPassword')) {
            $request->merge(['new_password' => $request->newPassword]);
        }
        if ($request->has('confirmPassword')) {
            $request->merge(['new_password_confirmation' => $request->confirmPassword]);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        $user->activities()->create([
            'action' => 'Changed Password',
            'description' => 'Security password successfully modified.',
        ]);

        return response()->json(['message' => 'Password changed successfully.']);
    }

    /**
     * Delete user account.
     */
    public function deleteAccount(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password. Account deletion failed.'], 422);
        }

        // Delete user's profile photo if stored locally
        if ($user->profile_photo && str_contains($user->profile_photo, 'profile_photos')) {
            $fileName = basename($user->profile_photo);
            $filePath = public_path('storage/profile_photos/' . $fileName);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $user->delete();

        return response()->json(['message' => 'Your account has been deleted successfully.']);
    }

    /**
     * Cancel registration.
     */
    public function cancelRegistration($id)
    {
        $user = Auth::user();
        $registration = $user->registrations()->find($id);

        if (!$registration) {
            return response()->json(['message' => 'Registration record not found.'], 404);
        }

        if ($registration->pass_status === 'Cancelled') {
            return response()->json(['message' => 'This registration is already cancelled.'], 400);
        }

        $event = $registration->event;
        
        // Ensure event start date is in the future
        $now = now();
        $startStr = $event->event_date->format('Y-m-d') . ' ' . $event->event_time;
        $start = \Carbon\Carbon::parse($startStr);
        if ($now->gte($start)) {
            return response()->json(['message' => 'Cannot cancel registrations for live or past events.'], 422);
        }

        $registration->update(['pass_status' => 'Cancelled']);

        // Increment event seats_left
        $event->increment('seats_left');

        // Log Activity
        $user->activities()->create([
            'action' => 'Cancelled Registration',
            'description' => "Cancelled registration for event '{$event->title}'.",
        ]);

        // Create Notification
        $user->notifications()->create([
            'type' => 'Event Updated',
            'title' => 'Registration Cancelled',
            'message' => "You have successfully cancelled your registration for '{$event->title}'. Your seat has been released.",
        ]);

        return response()->json(['message' => 'Registration cancelled successfully and seat released.']);
    }
}
