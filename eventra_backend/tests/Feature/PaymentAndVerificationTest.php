<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentAndVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    /**
     * Test participant signup redirect is mapped correctly.
     */
    public function test_participant_signup_api_works(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'name' => 'John Attendee',
            'email' => 'john.att@example.com',
            'phone' => '+8801700000002',
            'role' => 'participant',
            'interests' => 'Design, Coding',
            'location' => 'Dhaka',
            'password' => 'password123',
            'confirmPassword' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('user.email', 'john.att@example.com');
        $this->assertDatabaseHas('users', [
            'email' => 'john.att@example.com',
            'role' => 'participant',
        ]);
    }

    /**
     * Test initiating SSLCommerz payment session.
     */
    public function test_sslcommerz_initiation(): void
    {
        // 1. Setup user & event
        $participant = User::where('role', 'participant')->first();
        $this->assertNotNull($participant);

        $event = Event::where('ticket_type', 'paid')->first();
        $this->assertNotNull($event);

        // Ensure seats are available
        $event->seats_left = 10;
        $event->save();

        // 2. Perform initiation request
        $response = $this->postJson('/api/sslcommerz/initiate', [
            'event_id' => $event->id,
        ], [
            'Authorization' => 'Bearer ' . $participant->api_token,
        ]);

        // 3. Assert response structure and DB state
        $response->assertStatus(201);
        $response->assertJsonStructure(['gateway_url']);
        
        $this->assertDatabaseHas('event_registrations', [
            'user_id' => $participant->id,
            'event_id' => $event->id,
            'payment_status' => 'pending',
            'pass_status' => 'Pending Payment',
        ]);
    }

    /**
     * Test retrieving transaction details for the hosted checkout page.
     */
    public function test_sslcommerz_details_retrieval(): void
    {
        // 1. Setup user & event
        $participant = User::where('role', 'participant')->first();
        $event = Event::where('ticket_type', 'paid')->first();

        // 2. Create a pending registration
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'registration_code' => 'REG-DETAILSTEST',
            'payment_method' => 'SSLCommerz',
            'payment_amount' => (float)$event->ticket_price,
            'payment_status' => 'pending',
            'security_token' => 'SEC-DETAILSTEST',
            'pass_status' => 'Pending Payment',
            'registered_at' => now(),
            'transaction_id' => 'SSLC-TXN-DETAILSTEST',
        ]);

        // 3. Request transaction details
        $response = $this->getJson('/api/sslcommerz/details?tran_id=SSLC-TXN-DETAILSTEST');

        // 4. Assert response payload
        $response->assertStatus(200);
        $response->assertJson([
            'transaction_id' => 'SSLC-TXN-DETAILSTEST',
            'amount' => (float)$event->ticket_price,
            'event_title' => $event->title,
            'user_name' => $participant->name,
            'user_email' => $participant->email,
        ]);
    }

    /**
     * Test successful payment callback updates registration and seats.
     */
    public function test_sslcommerz_payment_success(): void
    {
        // 1. Setup user & event
        $participant = User::where('role', 'participant')->first();
        $event = Event::where('ticket_type', 'paid')->first();

        // Save original seat count and set seats_left
        $event->seats_left = 5;
        $event->save();

        // 2. Create a pending registration
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'registration_code' => 'REG-SUCCESSTEST',
            'payment_method' => 'SSLCommerz',
            'payment_amount' => (float)$event->ticket_price,
            'payment_status' => 'pending',
            'security_token' => 'SEC-SUCCESSTEST',
            'pass_status' => 'Pending Payment',
            'registered_at' => now(),
            'transaction_id' => 'SSLC-TXN-SUCCESSTEST',
        ]);

        // 3. Post to success callback
        $response = $this->postJson('/api/sslcommerz/success', [
            'tran_id' => 'SSLC-TXN-SUCCESSTEST',
            'payment_method' => 'bKash',
        ]);

        // 4. Assert redirect url and DB changes
        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'redirect_url' => 'http://localhost:5173/dashboard?payment_status=success',
        ]);

        $this->assertDatabaseHas('event_registrations', [
            'transaction_id' => 'SSLC-TXN-SUCCESSTEST',
            'payment_status' => 'paid',
            'pass_status' => 'Active',
            'payment_method' => 'bKash',
        ]);

        // Assert seat count decremented
        $this->assertEquals(4, $event->fresh()->seats_left);
    }

    /**
     * Test payment cancellation callback deletes pending registration.
     */
    public function test_sslcommerz_payment_cancel(): void
    {
        // 1. Setup user & event
        $participant = User::where('role', 'participant')->first();
        $event = Event::where('ticket_type', 'paid')->first();

        // 2. Create a pending registration
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'registration_code' => 'REG-CANCELTEST',
            'payment_method' => 'SSLCommerz',
            'payment_amount' => (float)$event->ticket_price,
            'payment_status' => 'pending',
            'security_token' => 'SEC-CANCELTEST',
            'pass_status' => 'Pending Payment',
            'registered_at' => now(),
            'transaction_id' => 'SSLC-TXN-CANCELTEST',
        ]);

        // 3. Post to cancel callback
        $response = $this->postJson('/api/sslcommerz/cancel', [
            'tran_id' => 'SSLC-TXN-CANCELTEST',
        ]);

        // 4. Assert response and database removal
        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'cancelled',
            'redirect_url' => 'http://localhost:5173/dashboard?payment_status=cancelled',
        ]);

        $this->assertDatabaseMissing('event_registrations', [
            'transaction_id' => 'SSLC-TXN-CANCELTEST',
        ]);
    }

    /**
     * Test public pass verification endpoint returns authentic details without session.
     */
    public function test_public_pass_verification(): void
    {
        // 1. Create a dummy registration
        $participant = User::where('role', 'participant')->first();
        $event = Event::first();
        
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'registration_code' => 'REG-TEST1234',
            'payment_method' => 'Nagad',
            'payment_amount' => 50.00,
            'payment_status' => 'paid',
            'security_token' => 'SEC-TEST12345678',
            'pass_status' => 'Active',
            'registered_at' => now(),
            'transaction_id' => 'NAGAD-TRX-998877',
            'payment_date' => now(),
        ]);

        // 2. Hit verification API
        $response = $this->getJson("/api/pass/verify?reg_id={$registration->id}&token=SEC-TEST12345678");

        $response->assertStatus(200);
        $response->assertJsonPath('registration.registration_code', 'REG-TEST1234');
        $response->assertJsonPath('registration.transaction_id', 'NAGAD-TRX-998877');
        $response->assertJsonPath('user.email', $participant->email);
        $response->assertJsonPath('event.title', $event->title);
    }

    /**
     * Test organizer can check in an attendee using the dashboard API.
     */
    public function test_organizer_attendance_checkin(): void
    {
        // 1. Create a registration
        $organizer = User::where('role', 'organizer')->where('status', 'approved')->first();
        $participant = User::where('role', 'participant')->first();
        $event = Event::where('created_by', $organizer->id)->first();
        if (!$event) {
            $event = Event::first();
            $event->created_by = $organizer->id;
            $event->save();
        }

        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'registration_code' => 'REG-SCAN99',
            'security_token' => 'SEC-SCAN99',
            'pass_status' => 'Active',
            'registered_at' => now(),
        ]);

        // 2. Call check-in API as Organizer
        $response = $this->putJson("/api/organizer/registrations/{$registration->id}/check-in", [], [
            'Authorization' => 'Bearer ' . $organizer->api_token,
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('registration.pass_status', 'Checked-in');
        
        $this->assertDatabaseHas('event_registrations', [
            'id' => $registration->id,
            'pass_status' => 'Checked-in',
        ]);

        // 3. Verify certificate is created automatically
        $this->assertDatabaseHas('certificates', [
            'event_id' => $event->id,
            'user_id' => $participant->id,
        ]);

        // 4. Try duplicate scan / check-in
        $responseDuplicate = $this->putJson("/api/organizer/registrations/{$registration->id}/check-in", [], [
            'Authorization' => 'Bearer ' . $organizer->api_token,
        ]);
        $responseDuplicate->assertStatus(409);
        $responseDuplicate->assertJsonPath('message', 'This pass has already been checked-in. Duplicate scan prevented.');

        // 5. Cancel check-in
        $responseCancel = $this->putJson("/api/organizer/registrations/{$registration->id}/check-in?action=cancel", [], [
            'Authorization' => 'Bearer ' . $organizer->api_token,
        ]);
        $responseCancel->assertStatus(200);
        $responseCancel->assertJsonPath('registration.pass_status', 'Active');

        // 6. Verify certificate is deleted upon cancellation
        $this->assertDatabaseMissing('certificates', [
            'event_id' => $event->id,
            'user_id' => $participant->id,
        ]);
    }

    /**
     * Test participant payments history endpoint.
     */
    public function test_participant_payments_history(): void
    {
        $participant = User::where('role', 'participant')->first();
        $event = Event::first();

        // Create a registration with payment
        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'registration_code' => 'REG-PAYLIST',
            'payment_method' => 'Visa',
            'payment_amount' => 100.00,
            'payment_status' => 'paid',
            'security_token' => 'SEC-PAYLIST',
            'pass_status' => 'Active',
            'registered_at' => now(),
            'transaction_id' => 'VISA-TRX-112233',
            'payment_date' => now(),
        ]);

        $response = $this->getJson('/api/user/payments', [
            'Authorization' => 'Bearer ' . $participant->api_token,
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'registration_code' => 'REG-PAYLIST',
            'payment_method' => 'Visa',
            'transaction_id' => 'VISA-TRX-112233',
        ]);
    }

    /**
     * Test admin rules configuration and organizer approval workflow.
     */
    public function test_admin_settings_and_organizer_approval_rules(): void
    {
        // 1. Login as Admin
        $admin = User::where('role', 'admin')->first();
        $this->assertNotNull($admin);

        // Authenticate admin web session
        $this->actingAs($admin);

        // 2. Post rules change in Admin Panel settings
        $response = $this->post(route('admin.settings.rules'), [
            'organizer_rules_regulations' => "1. Keep events professional.\n2. Respect participants.",
        ]);

        $response->assertStatus(302); // Redirect back
        $this->assertEquals("1. Keep events professional.\n2. Respect participants.", Setting::getValue('organizer_rules_regulations'));

        // 3. Approve a pending organizer
        $pendingOrganizer = User::where('role', 'organizer')->where('status', 'pending')->first();
        if (!$pendingOrganizer) {
            $pendingOrganizer = User::create([
                'name' => 'New Pending Host',
                'email' => 'new.pending@example.com',
                'phone' => '+8801900000000',
                'role' => 'organizer',
                'status' => 'pending',
                'password' => bcrypt('password123'),
            ]);
        }

        $approveResponse = $this->post(route('admin.organizers.approve', $pendingOrganizer));
        $approveResponse->assertStatus(302);
        
        $this->assertEquals('approved', $pendingOrganizer->fresh()->status);
    }

    /**
     * Test admin can delete user contact message.
     */
    public function test_admin_can_delete_contact_message(): void
    {
        $admin = User::where('role', 'admin')->first();
        $this->actingAs($admin);

        // Create a contact message
        $message = \App\Models\ContactMessage::create([
            'name' => 'Test User',
            'email' => 'test.user@example.com',
            'subject' => 'Help Request',
            'phone' => '+8801700000000',
            'message' => 'Please help me with registration.',
        ]);

        $response = $this->delete(route('admin.contact.messages.delete', $message->id));
        $response->assertStatus(302);
        
        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
        ]);
    }

    /**
     * Test certificate verification endpoint.
     */
    public function test_certificate_verification_api(): void
    {
        $participant = User::where('role', 'participant')->first();
        $event = Event::first();

        // Create a certificate
        $certificate = \App\Models\Certificate::create([
            'certificate_code' => 'EVT-2026-ABCDEF',
            'event_id' => $event->id,
            'user_id' => $participant->id,
            'issued_at' => now(),
        ]);

        $response = $this->postJson('/api/certificates/verify', [
            'certificate_code' => 'EVT-2026-ABCDEF',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => 'EVT-2026-ABCDEF',
            'participantName' => $participant->name,
            'eventName' => $event->title,
            'eventId' => $event->id,
            'eventSlug' => $event->slug,
            'status' => 'Verified',
        ]);
    }
}
