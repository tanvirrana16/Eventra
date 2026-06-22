<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Event;
use App\Models\Category;
use App\Models\EventRegistration;
use App\Models\Certificate;
use App\Models\Notification;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class OrganizerDashboardController extends Controller
{
    /**
     * Get dashboard stats and overview analytics for the organizer.
     */
    public function dashboard()
    {
        $user = Auth::user();

        // 1. Stats calculation
        $totalEvents = Event::where('created_by', $user->id)->count();
        
        $now = now();
        $liveEvents = Event::where('created_by', $user->id)
            ->where('status', 'published')
            ->where('event_date', '<=', $now->toDateString())
            ->where(function($q) use ($now) {
                $q->whereNull('event_end_date')
                  ->orWhere('event_end_date', '>=', $now->toDateString());
            })->count();

        $upcomingEvents = Event::where('created_by', $user->id)
            ->where('status', 'published')
            ->where('event_date', '>', $now->toDateString())
            ->count();

        $totalRegistrations = EventRegistration::whereHas('event', function ($q) use ($user) {
            $q->where('created_by', $user->id);
        })->count();

        $revenue = (float) EventRegistration::whereHas('event', function ($q) use ($user) {
            $q->where('created_by', $user->id);
        })->where('payment_status', 'paid')->sum('payment_amount');

        $certificatesIssued = Certificate::whereHas('event', function ($q) use ($user) {
            $q->where('created_by', $user->id);
        })->count();

        // 2. Recent Registrations list
        $recentRegistrations = EventRegistration::whereHas('event', function ($q) use ($user) {
            $q->where('created_by', $user->id);
        })->with(['user', 'event'])
          ->orderBy('registered_at', 'desc')
          ->take(5)
          ->get()
          ->map(function ($reg) {
              return [
                  'id' => $reg->id,
                  'registration_code' => $reg->registration_code,
                  'participant_name' => $reg->user->name ?? 'Unknown User',
                  'event_title' => $reg->event->title ?? 'Unknown Event',
                  'registered_at' => $reg->registered_at ? $reg->registered_at->toDateTimeString() : null,
                  'payment_status' => $reg->payment_status,
              ];
          });

        // Seed initial organizer notifications if empty
        if ($user->notifications()->count() === 0) {
            $user->notifications()->createMany([
                [
                    'type' => 'Event Published',
                    'title' => 'Event Live Status',
                    'message' => 'Congratulations! Your event "Tech Innovation Summit 2026" has been successfully approved and published.',
                    'created_at' => now()->subHours(4),
                ],
                [
                    'type' => 'New Registration',
                    'title' => 'New Participant Registered',
                    'message' => 'A new participant has registered for your upcoming UI/UX Creative Design Masterclass.',
                    'created_at' => now()->subHours(1),
                ]
            ]);
        }

        return response()->json([
            'stats' => [
                'total_events' => $totalEvents,
                'live_events' => $liveEvents,
                'upcoming_events' => $upcomingEvents,
                'total_registrations' => $totalRegistrations,
                'revenue' => $revenue,
                'certificates_issued' => $certificatesIssued,
            ],
            'recent_registrations' => $recentRegistrations,
        ]);
    }

    /**
     * Get organizer's created events.
     */
    public function events()
    {
        $user = Auth::user();
        $events = Event::where('created_by', $user->id)->with('category')->get()->map(function ($event) {
            $registrationsCount = $event->registrations()->count();
            $revenue = (float) $event->registrations()->where('payment_status', 'paid')->sum('payment_amount');
            
            // Available Seats
            $availableSeats = max(0, $event->total_seats - $registrationsCount);

            return [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'category' => $event->category->name ?? 'Uncategorized',
                'event_date' => $event->event_date ? $event->event_date->format('Y-m-d') : null,
                'event_time' => $event->event_time,
                'event_end_date' => $event->event_end_date ? $event->event_end_date->format('Y-m-d') : null,
                'event_end_time' => $event->event_end_time,
                'registration_deadline' => $event->registration_deadline ? $event->registration_deadline->format('Y-m-d') : null,
                'status' => $event->status,
                'seats_available' => $availableSeats,
                'total_seats' => $event->total_seats,
                'registrations' => $registrationsCount,
                'revenue' => $revenue,
                'image' => $event->image_path,
                'ticket_type' => $event->ticket_type,
                'ticket_price' => (float) $event->ticket_price,
                'currency' => $event->currency,
                'payment_methods' => $event->payment_methods ?? [],
                'description' => $event->description,
                'location' => $event->location,
                'contact_details' => $event->contact_details,
                'rules' => $event->rules ?? [],
                'speakers' => $event->speakers ?? [],
                'tags' => $event->tags ?? [],
                'gallery' => $event->gallery ?? [],
            ];
        });

        return response()->json($events);
    }

    /**
     * Create event from multi-step wizard.
     */
    public function createEvent(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'registration_deadline' => 'nullable|date',
            'event_time' => 'required|string',
            'event_end_date' => 'nullable|date',
            'event_end_time' => 'nullable|string',
            'location' => 'required|string', // venue name + address
            'contact_details' => 'nullable|string',
            'total_seats' => 'required|integer|min:1',
            'ticket_type' => 'required|in:free,paid',
            'ticket_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string',
            'payment_methods' => 'nullable|array',
            'rules' => 'nullable|array',
            'speakers' => 'nullable|array',
            'tags' => 'nullable|array',
            'image' => 'nullable|string', // base64 string
            'gallery' => 'nullable|array', // array of base64 strings
            'status' => 'nullable|in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find or create Category
        $category = Category::where('name', $request->category)->first();
        if (!$category) {
            $category = Category::create([
                'name' => $request->category,
                'slug' => Str::slug($request->category)
            ]);
        }

        // Handle Main Poster Upload (base64)
        $imagePath = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'; // fallback
        if ($request->filled('image')) {
            $imagePath = $this->saveBase64Image($request->image, 'event_posters', 'poster_' . time());
        }

        // Handle Gallery Uploads (base64)
        $galleryPaths = [];
        if ($request->has('gallery') && is_array($request->gallery)) {
            foreach ($request->gallery as $idx => $base64) {
                $galleryPaths[] = $this->saveBase64Image($base64, 'event_gallery', 'gallery_' . time() . '_' . $idx);
            }
        }

        // Create the event
        $event = Event::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'description' => $request->description,
            'event_date' => $request->event_date,
            'registration_deadline' => $request->registration_deadline,
            'event_time' => $request->event_time,
            'event_end_date' => $request->event_end_date,
            'event_end_time' => $request->event_end_time,
            'location' => $request->location,
            'contact_details' => $request->contact_details,
            'total_seats' => $request->total_seats,
            'seats_left' => $request->total_seats,
            'ticket_type' => $request->ticket_type,
            'ticket_price' => $request->ticket_type === 'paid' ? (float)$request->ticket_price : 0.00,
            'currency' => $request->currency ?? 'USD',
            'payment_methods' => $request->payment_methods ?? [],
            'rules' => $request->rules ?? [],
            'speakers' => $request->speakers ?? [],
            'tags' => $request->tags ?? [],
            'image_path' => $imagePath,
            'gallery' => $galleryPaths,
            'status' => $request->status ?? 'published',
            'category_id' => $category->id,
            'created_by' => $user->id,
            'rating' => 5.00
        ]);

        // Log activity
        $user->activities()->create([
            'action' => 'Created Event',
            'description' => "Organizer created event '{$event->title}' in status '{$event->status}'."
        ]);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $event
        ], 201);
    }

    /**
     * Update an event.
     */
    public function updateEvent(Request $request, $id)
    {
        $user = Auth::user();
        $event = Event::where('created_by', $user->id)->find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'registration_deadline' => 'nullable|date',
            'event_time' => 'required|string',
            'event_end_date' => 'nullable|date',
            'event_end_time' => 'nullable|string',
            'location' => 'required|string',
            'contact_details' => 'nullable|string',
            'total_seats' => 'required|integer|min:1',
            'ticket_type' => 'required|in:free,paid',
            'ticket_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string',
            'payment_methods' => 'nullable|array',
            'rules' => 'nullable|array',
            'speakers' => 'nullable|array',
            'tags' => 'nullable|array',
            'image' => 'nullable|string', // base64
            'gallery' => 'nullable|array', // array of base64s
            'status' => 'nullable|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Category
        $category = Category::where('name', $request->category)->first();
        if (!$category) {
            $category = Category::create([
                'name' => $request->category,
                'slug' => Str::slug($request->category)
            ]);
        }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'event_date' => $request->event_date,
            'registration_deadline' => $request->registration_deadline,
            'event_time' => $request->event_time,
            'event_end_date' => $request->event_end_date,
            'event_end_time' => $request->event_end_time,
            'location' => $request->location,
            'contact_details' => $request->contact_details,
            'ticket_type' => $request->ticket_type,
            'ticket_price' => $request->ticket_type === 'paid' ? (float)$request->ticket_price : 0.00,
            'currency' => $request->currency ?? 'USD',
            'payment_methods' => $request->payment_methods ?? [],
            'rules' => $request->rules ?? [],
            'speakers' => $request->speakers ?? [],
            'tags' => $request->tags ?? [],
            'status' => $request->status ?? $event->status,
            'category_id' => $category->id,
        ];

        // Seat capacity adjustment
        $regsCount = $event->registrations()->count();
        $data['total_seats'] = $request->total_seats;
        $data['seats_left'] = max(0, $request->total_seats - $regsCount);

        // Poster image update
        if ($request->filled('image')) {
            $data['image_path'] = $this->saveBase64Image($request->image, 'event_posters', 'poster_' . time());
        }

        // Gallery update
        if ($request->has('gallery') && is_array($request->gallery)) {
            $galleryPaths = [];
            foreach ($request->gallery as $idx => $base64) {
                if (str_starts_with($base64, 'http')) {
                    // Pre-existing image URL
                    $galleryPaths[] = $base64;
                } else {
                    // New base64 file upload
                    $galleryPaths[] = $this->saveBase64Image($base64, 'event_gallery', 'gallery_' . time() . '_' . $idx);
                }
            }
            $data['gallery'] = $galleryPaths;
        }

        $event->update($data);

        // Log activity
        $user->activities()->create([
            'action' => 'Updated Event',
            'description' => "Organizer updated event '{$event->title}'."
        ]);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event
        ]);
    }

    /**
     * Delete/Archive event.
     */
    public function deleteEvent($id)
    {
        $user = Auth::user();
        $event = Event::where('created_by', $user->id)->find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        // Set status to archived or hard delete if draft
        if ($event->status === 'draft') {
            $event->delete();
            $msg = 'Draft event deleted successfully.';
        } else {
            $event->update(['status' => 'archived']);
            $msg = 'Event archived successfully.';
        }

        $user->activities()->create([
            'action' => 'Deleted Event',
            'description' => "Organizer deleted/archived event '{$event->title}'."
        ]);

        return response()->json(['message' => $msg]);
    }

    /**
     * View registered participants.
     */
    public function participants()
    {
        $user = Auth::user();
        $registrations = EventRegistration::whereHas('event', function ($q) use ($user) {
            $q->where('created_by', $user->id);
        })->with(['user', 'event'])->get()->map(function ($reg) {
            return [
                'id' => $reg->id,
                'participant_name' => $reg->user->name ?? 'Unknown User',
                'participant_email' => $reg->user->email ?? 'N/A',
                'participant_phone' => $reg->user->phone ?? 'N/A',
                'registration_date' => $reg->registered_at ? $reg->registered_at->format('Y-m-d') : null,
                'event_title' => $reg->event->title ?? 'N/A',
                'ticket_status' => $reg->pass_status, // Active, Checked-in, Cancelled
            ];
        });

        return response()->json($registrations);
    }

    /**
     * Check-in participant.
     */
    public function checkIn($id)
    {
        $user = Auth::user();
        
        $registration = EventRegistration::whereHas('event', function($q) use ($user) {
            $q->where('created_by', $user->id);
        })->find($id);

        if (!$registration) {
            return response()->json(['message' => 'Registration pass not found.'], 404);
        }

        if ($registration->pass_status === 'Cancelled') {
            return response()->json(['message' => 'Cannot check-in a cancelled pass.'], 400);
        }

        $newStatus = $registration->pass_status === 'Checked-in' ? 'Active' : 'Checked-in';
        $registration->update(['pass_status' => $newStatus]);

        $user->activities()->create([
            'action' => 'Checked-in Participant',
            'description' => "Participant check-in status updated to '{$newStatus}' for {$registration->registration_code}."
        ]);

        return response()->json([
            'message' => "Participant check-in status updated to '{$newStatus}' successfully.",
            'registration' => $registration
        ]);
    }

    /**
     * Get organizer performance analytics.
     */
    public function analytics()
    {
        $user = Auth::user();
        $events = Event::where('created_by', $user->id)->get();

        // Popular Categories
        $categoriesCount = [];
        foreach ($events as $e) {
            $catName = $e->category->name ?? 'Uncategorized';
            $categoriesCount[$catName] = ($categoriesCount[$catName] ?? 0) + 1;
        }
        $popularCategories = [];
        foreach ($categoriesCount as $name => $count) {
            $popularCategories[] = ['name' => $name, 'value' => $count];
        }

        // Calculations for utilization
        $totalSeats = (int) $events->sum('total_seats');
        $totalRegistrations = (int) EventRegistration::whereHas('event', function($q) use ($user) {
            $q->where('created_by', $user->id);
        })->count();

        $seatUtilization = $totalSeats > 0 ? round(($totalRegistrations / $totalSeats) * 100, 1) : 0;

        $checkedIn = (int) EventRegistration::whereHas('event', function($q) use ($user) {
            $q->where('created_by', $user->id);
        })->where('pass_status', 'Checked-in')->count();

        $attendanceRate = $totalRegistrations > 0 ? round(($checkedIn / $totalRegistrations) * 100, 1) : 0;

        // Monthly Earnings line data (mocking for aesthetic charts)
        $monthlyRevenue = [
            ['month' => 'Jan', 'revenue' => 1200],
            ['month' => 'Feb', 'revenue' => 1800],
            ['month' => 'Mar', 'revenue' => 2400],
            ['month' => 'Apr', 'revenue' => 2100],
            ['month' => 'May', 'revenue' => 3800],
            ['month' => 'Jun', 'revenue' => $totalRegistrations * 20],
        ];

        // Event revenue comparison (mocking bar data)
        $eventComparison = [];
        foreach ($events->take(5) as $e) {
            $comparisonRev = $e->registrations()->where('payment_status', 'paid')->sum('payment_amount');
            $eventComparison[] = [
                'name' => Str::limit($e->title, 12),
                'revenue' => (float) $comparisonRev
            ];
        }

        // Traffic sources (mocking donut data)
        $trafficSources = [
            ['name' => 'Search Engines', 'value' => 35],
            ['name' => 'Social Media', 'value' => 45],
            ['name' => 'Email Campaign', 'value' => 12],
            ['name' => 'Direct Traffic', 'value' => 8],
        ];

        return response()->json([
            'popular_categories' => $popularCategories,
            'seat_utilization' => $seatUtilization,
            'attendance_rate' => $attendanceRate,
            'monthly_revenue' => $monthlyRevenue,
            'event_comparison' => $eventComparison,
            'traffic_sources' => $trafficSources
        ]);
    }

    /**
     * Get organizer notifications list.
     */
    public function notifications()
    {
        $user = Auth::user();
        return response()->json($user->notifications()->orderBy('created_at', 'desc')->get());
    }

    /**
     * Mark all notifications read.
     */
    public function markAllRead()
    {
        $user = Auth::user();
        $user->notifications()->update(['is_read' => true]);
        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Mark single notification read.
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
        return response()->json(['message' => 'Notification deleted successfully.']);
    }

    /**
     * Get organizer profile.
     */
    public function profile()
    {
        return response()->json(Auth::user());
    }

    /**
     * Update organizer profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        // Normalize frontend fields
        if ($request->has('organizationName')) {
            $request->merge(['organization_name' => $request->organizationName]);
        }
        if ($request->has('socialLinks')) {
            $request->merge(['social_links' => $request->socialLinks]);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'organization_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
            'profile_photo' => 'nullable|string', // base64 photo upload
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'name', 'phone', 'organization_name', 'address', 'website', 'social_links'
        ]);

        // Process profile photo base64 payload
        if ($request->filled('profile_photo')) {
            $photoData = $request->profile_photo;
            if (str_starts_with($photoData, 'data:image')) {
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

        $user->activities()->create([
            'action' => 'Updated Profile',
            'description' => 'Organizer profile details updated.'
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Change organizer password.
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        // Normalize fields
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
            return response()->json(['message' => 'Current password does not match.'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        $user->activities()->create([
            'action' => 'Changed Password',
            'description' => 'Successfully modified security credentials.'
        ]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    /**
     * Update settings.
     */
    public function updateSettings(Request $request)
    {
        $user = Auth::user();

        if ($request->has('twoFactorEnabled')) {
            $request->merge(['two_factor_enabled' => $request->twoFactorEnabled]);
        }
        if ($request->has('emailNotifications')) {
            $request->merge(['email_notifications' => $request->emailNotifications]);
        }
        if ($request->has('smsNotifications')) {
            $request->merge(['sms_notifications' => $request->smsNotifications]);
        }

        $validator = Validator::make($request->all(), [
            'two_factor_enabled' => 'nullable|boolean',
            'email_notifications' => 'nullable|boolean',
            'sms_notifications' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only([
            'two_factor_enabled', 'email_notifications', 'sms_notifications'
        ]));

        $user->activities()->create([
            'action' => 'Updated Settings',
            'description' => 'Organizer privacy settings updated.'
        ]);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Generate certificates for completed event.
     */
    public function generateCertificates(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'event_id' => 'required|exists:events,id',
        ]);

        $event = Event::where('created_by', $user->id)->find($request->event_id);
        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        // Fetch participants who registered and did not cancel
        $registrations = EventRegistration::where('event_id', $event->id)
            ->where('pass_status', '!=', 'Cancelled')
            ->get();

        if ($registrations->isEmpty()) {
            return response()->json(['message' => 'No participants registered for this event.'], 400);
        }

        $generatedCount = 0;
        foreach ($registrations as $reg) {
            // Check if certificate already exists
            $exists = Certificate::where('event_id', $event->id)
                ->where('user_id', $reg->user_id)
                ->exists();

            if (!$exists) {
                Certificate::create([
                    'event_id' => $event->id,
                    'user_id' => $reg->user_id,
                    'certificate_code' => 'CERT-' . strtoupper(Str::random(12)),
                    'issued_at' => now(),
                ]);
                $generatedCount++;
            }
        }

        $user->activities()->create([
            'action' => 'Generated Certificates',
            'description' => "Generated {$generatedCount} certificate(s) for event '{$event->title}'."
        ]);

        return response()->json([
            'message' => "Generated {$generatedCount} certificate(s) successfully."
        ]);
    }

    /**
     * Get organizer's certificates list.
     */
    public function certificates()
    {
        $user = Auth::user();
        $certificates = Certificate::whereHas('event', function ($q) use ($user) {
            $q->where('created_by', $user->id);
        })->with(['event.organizer', 'user'])->get()->map(function ($cert) {
            return [
                'id' => $cert->id,
                'event_name' => $cert->event->title ?? 'Unknown Event',
                'certificate_code' => $cert->certificate_code,
                'issue_date' => $cert->issued_at ? $cert->issued_at->format('Y-m-d') : null,
                'issue_date_text' => $cert->issued_at ? $cert->issued_at->format('F j, Y') : null,
                'status' => 'Issued',
                'organizer' => $cert->event->organizer->organization_name ?? $cert->event->organizer->name ?? 'Eventra Team',
                'participant_name' => $cert->user->name ?? 'Unknown User',
            ];
        });

        return response()->json($certificates);
    }

    /**
     * Send Certificates by Email (simulated).
     */
    public function sendCertificates(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'certificate_id' => 'required|exists:certificates,id',
        ]);

        $cert = Certificate::with(['event.organizer', 'user'])->find($request->certificate_id);
        
        $emailContent = <<<EOT
=========================================
EMAIL SIMULATION DISPATCH (CERTIFICATE)
To: {$cert->user->email}
Subject: Certificate of Participation: {$cert->event->title}
-----------------------------------------
Hello {$cert->user->name},

Your certificate of participation for "{$cert->event->title}" is now available.

Verification Details:
- Certificate ID: {$cert->certificate_code}
- Issue Date: {$cert->issued_at->format('F j, Y')}
- Verify Link: http://localhost:5173/certificate-verification?code={$cert->certificate_code}

Best regards,
The Eventra Coordination Team
=========================================
EOT;

        Log::info($emailContent);

        $user->activities()->create([
            'action' => 'Emailed Certificate',
            'description' => "Dispatched simulated email certificate {$cert->certificate_code} to {$cert->user->email}."
        ]);

        return response()->json(['message' => 'Simulated certificate email dispatched successfully. Check backend logs!']);
    }

    /**
     * Decodes and stores base64 image strings.
     */
    private function saveBase64Image($base64String, $folder, $filename)
    {
        if (str_starts_with($base64String, 'data:image')) {
            $extension = explode('/', explode(':', substr($base64String, 0, strpos($base64String, ';')))[1])[1];
            $replace = substr($base64String, 0, strpos($base64String, ',') + 1);
            $image = str_replace($replace, '', $base64String);
            $image = str_replace(' ', '+', $image);
            $imageName = $filename . '.' . $extension;
            
            $dirPath = public_path('storage/' . $folder);
            if (!file_exists($dirPath)) {
                mkdir($dirPath, 0755, true);
            }
            
            file_put_contents($dirPath . '/' . $imageName, base64_decode($image));
            return asset('storage/' . $folder . '/' . $imageName);
        }
        
        return $base64String; // return raw url if it is not base64
    }
}
