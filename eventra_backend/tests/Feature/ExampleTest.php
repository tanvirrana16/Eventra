<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;
    /**
     * Test that the homepage redirects to admin login.
     */
    public function test_homepage_redirects_to_admin_login(): void
    {
        $response = $this->get('/');
        $response->assertStatus(302);
        $response->assertRedirect(route('admin.login'));
    }

    /**
     * Test that the admin login page loads successfully.
     */
    public function test_admin_login_page_loads(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
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
            'latest_events',
            'upcoming_events',
            'stats' => ['total_events', 'participants', 'organizers', 'certificates'],
            'footer' => ['brand', 'contact_global', 'contact_bd', 'support_links', 'eventra_links'],
        ]);
    }
}
