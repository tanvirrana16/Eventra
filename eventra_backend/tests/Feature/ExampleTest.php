<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;
    /**
     * Test that the homepage redirects to the React frontend homepage.
     */
    public function test_homepage_redirects_to_frontend_homepage(): void
    {
        $response = $this->get('/');
        $response->assertStatus(302);
        $response->assertRedirect('http://localhost:5173');
    }

    /**
     * Test that accessing the protected admin dashboard unauthenticated redirects to frontend login.
     */
    public function test_unauthenticated_admin_dashboard_redirects_to_frontend_login(): void
    {
        $response = $this->get('/admin');
        $response->assertStatus(302);
        $response->assertRedirect('http://localhost:5173/login');
    }

    /**
     * Test that the public homepage API returns valid structure.
     */
    public function test_homepage_feed_api_returns_expected_structure(): void
    {
        $response = $this->get('/api/homepage');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'hero' => ['title', 'subtitle', 'btn1_text', 'btn1_url', 'btn2_text', 'btn2_url'],
            'slider',
            'top_categories',
            'latest_events' => [
                '*' => [
                    'id', 'title', 'slug', 'category', 'dateBadge', 'dateText', 'time', 'venue', 'image',
                    'organizer' => ['name', 'avatar', 'organizationName', 'contactInfo'],
                    'seatsLeft', 'rating', 'gallery', 'speakers', 'tags', 'description', 'status'
                ]
            ],
            'upcoming_events',
            'stats' => ['total_events', 'participants', 'organizers', 'certificates'],
            'footer' => ['brand', 'contact_global', 'contact_bd', 'support_links', 'eventra_links'],
        ]);
    }

    /**
     * Test user registration with camelCase parameters matching the frontend.
     */
    public function test_user_registration_handles_camelcase_frontend_parameters(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'name' => 'John Organizer',
            'email' => 'john.org@example.com',
            'phone' => '+8801700000000',
            'role' => 'organizer',
            'organizationName' => 'John Tech Inc',
            'contactInfo' => 'contact@johntech.com',
            'password' => 'password123',
            'confirmPassword' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('user.organizationName', 'John Tech Inc');
        $response->assertJsonPath('user.contactInfo', 'contact@johntech.com');
        $this->assertDatabaseHas('users', [
            'email' => 'john.org@example.com',
            'organization_name' => 'John Tech Inc',
            'contact_info' => 'contact@johntech.com',
        ]);
    }
}
