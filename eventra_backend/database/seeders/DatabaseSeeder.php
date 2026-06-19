<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use App\Models\HeroSlide;
use App\Models\PageHero;
use App\Models\Category;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Certificate;
use App\Models\FooterLink;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (Admin, Organizer, Participant)
        $admin = User::create([
            'name' => 'Eventra Admin',
            'email' => 'admin@eventra.com',
            'phone' => '+8801712345678',
            'role' => 'admin',
            'status' => 'approved',
            'password' => Hash::make('password123'),
        ]);

        $organizer1 = User::create([
            'name' => 'Eventra Team',
            'email' => 'organizer@eventra.com',
            'phone' => '+8801812345678',
            'role' => 'organizer',
            'status' => 'approved',
            'organization_name' => 'Eventra Global Corp',
            'contact_info' => 'contact@eventra.com',
            'password' => Hash::make('password123'),
        ]);

        $organizer2 = User::create([
            'name' => 'Pending Host',
            'email' => 'pending@eventra.com',
            'phone' => '+8801912345678',
            'role' => 'organizer',
            'status' => 'pending',
            'organization_name' => 'Future Events Group',
            'contact_info' => 'info@futureevents.org',
            'password' => Hash::make('password123'),
        ]);

        $participant = User::create([
            'name' => 'Tanvir Rana',
            'email' => 'participant@eventra.com',
            'phone' => '+8801512345678',
            'role' => 'participant',
            'status' => 'approved',
            'interests' => 'Design, Coding, Tech',
            'location' => 'Dhaka, Bangladesh',
            'password' => Hash::make('password123'),
        ]);

        // Create 20 more mock participants for registration stats
        $mockParticipants = [];
        for ($i = 1; $i <= 20; $i++) {
            $mockParticipants[] = User::create([
                'name' => "Mock User $i",
                'email' => "user$i@example.com",
                'phone' => "+1 555-01" . str_pad($i, 2, '0', STR_PAD_LEFT),
                'role' => 'participant',
                'status' => 'approved',
                'password' => Hash::make('password123'),
            ]);
        }

        // 2. Seed Hero Section Settings
        Setting::setValue('hero_title', 'Discover Local Events, Meet New Communities');
        Setting::setValue('hero_subtitle', 'Discover exciting events happening around you—from workshops, seminars, hackathons, networking sessions, cultural festivals, and community meetups. Connect with like-minded people, expand your network, learn new skills, and create unforgettable experiences with Eventra.');
        Setting::setValue('hero_btn1_text', 'Explore Events');
        Setting::setValue('hero_btn1_url', '/events');
        Setting::setValue('hero_btn2_text', 'Host Event');
        Setting::setValue('hero_btn2_url', '/signup');

        // 3. Seed Hero Slides
        HeroSlide::create([
            'image_path' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
            'title' => 'Tech Summit 2026',
            'description' => 'Join the biggest developer summit of the year.',
            'link' => '/events',
            'display_order' => 1,
            'is_active' => true,
        ]);
        HeroSlide::create([
            'image_path' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
            'title' => 'Design Workshop',
            'description' => 'Master UI/UX with professional Figma design grids.',
            'link' => '/events',
            'display_order' => 2,
            'is_active' => true,
        ]);

        // 4. Seed Reusable Page Heroes
        PageHero::create([
            'page' => 'events',
            'title' => 'Explore Upcoming Events',
            'subtitle' => 'Find local workshops, professional tech summits, lifestyle retreats, and sports tournaments.',
            'background_color' => '#0C3B2E',
        ]);
        PageHero::create([
            'page' => 'services',
            'title' => 'Our Premium Services',
            'subtitle' => 'Check out our advanced ticketing, event tracking, certificates, and community features.',
            'background_color' => '#0C3B2E',
        ]);
        PageHero::create([
            'page' => 'certificate-verification',
            'title' => 'Certificate Verification',
            'subtitle' => 'Verify credentials, milestones, and credentials issued by the Eventra platform.',
            'background_color' => '#0C3B2E',
        ]);
        PageHero::create([
            'page' => 'about-us',
            'title' => 'About Eventra',
            'subtitle' => 'We connect creators, organizers, and communities to elevate learning and events.',
            'background_color' => '#0C3B2E',
        ]);
        PageHero::create([
            'page' => 'contact-us',
            'title' => 'Contact Our Team',
            'subtitle' => 'Get in touch with organizers, query support, or file general issues.',
            'background_color' => '#0C3B2E',
        ]);

        // 5. Seed Categories
        $categoriesList = [
            ['name' => 'Concert', 'icon_name' => 'Music'],
            ['name' => 'Sports', 'icon_name' => 'Activity'],
            ['name' => 'Workshops', 'icon_name' => 'Laptop'],
            ['name' => 'Fundraisers', 'icon_name' => 'Heart'],
            ['name' => 'Festivals', 'icon_name' => 'Sparkles'],
            ['name' => 'Competitions', 'icon_name' => 'Trophy'],
            ['name' => 'Fashion Shows', 'icon_name' => 'Scissors'],
            ['name' => 'Conferences', 'icon_name' => 'Presentation'],
            ['name' => 'Seminars', 'icon_name' => 'GraduationCap'],
            ['name' => 'Reunions', 'icon_name' => 'Users'],
            ['name' => 'Exhibitions', 'icon_name' => 'Image'],
            ['name' => 'Launching', 'icon_name' => 'Rocket'],
            ['name' => 'Stand-up', 'icon_name' => 'Smile'],
            ['name' => 'Party', 'icon_name' => 'GlassWater'],
            ['name' => 'Pop Culture', 'icon_name' => 'Compass'],
            ['name' => 'Movie / Drama', 'icon_name' => 'Film'],
        ];

        $categories = [];
        foreach ($categoriesList as $cat) {
            $categories[$cat['name']] = Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'icon_name' => $cat['icon_name'],
            ]);
        }

        // 6. Seed Events
        $eventsData = [
            [
                'title' => 'Global Tech Summit & Developer Convention 2026',
                'description' => 'Connect with tech leaders, developers, and creators globally. Topics include Next-Gen Web, Artificial Intelligence, Blockchain systems, and Quantum computing. Gain valuable insights from panel discussions and networking sessions.',
                'event_date' => '2026-06-28',
                'event_time' => '09:00:00',
                'location' => 'Convention Center Hall A, New York',
                'image_path' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Conferences',
            ],
            [
                'title' => 'UI/UX & Creative Product Design Masterclass',
                'description' => 'Learn the core fundamentals of UX research, layout grids, visual hierarchy, mobile typography, and advanced micro-interaction prototyping in Figma from an industry expert.',
                'event_date' => '2026-07-05',
                'event_time' => '10:00:00',
                'location' => 'Creative Design Hub, San Francisco',
                'image_path' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Workshops',
            ],
            [
                'title' => 'SaaS Startup Pitch & Venture Investor Meetup',
                'description' => 'Pitch your early-stage SaaS startup directly to active angel investors and VC partners. Get immediate structural feedback and explore investment opportunities. Networking drinks included.',
                'event_date' => '2026-07-12',
                'event_time' => '16:00:00',
                'location' => 'Venture Capital Tower, Chicago',
                'image_path' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Conferences',
            ],
            [
                'title' => 'Sustainable Green Energy Solutions Summit',
                'description' => 'Explore the latest developments in carbon reduction, grid optimization, domestic solar panel systems, wind storage generators, and sustainable lithium battery recycling schemes.',
                'event_date' => '2026-07-18',
                'event_time' => '11:00:00',
                'location' => 'Eco-Park Civic Auditorium, Austin',
                'image_path' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Conferences',
            ],
            [
                'title' => 'Creative Writing Workshop & Poetry Slam Night',
                'description' => 'Unleash your inner author! Learn structural editing, character framing, narrative voice building, and perform live poetry slams in a cozy local creative hub.',
                'event_date' => '2026-07-25',
                'event_time' => '18:00:00',
                'location' => 'The Writer\'s Coffee Lounge, Portland',
                'image_path' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Workshops',
            ],
            [
                'title' => 'Urban Hiking & Wilderness Photography Expedition',
                'description' => 'Discover nature photography techniques like exposure brackets, raw depth fields, composition scales, and golden-hour edits while hiking Seattle\'s premium canyon trails.',
                'event_date' => '2026-08-02',
                'event_time' => '07:00:00',
                'location' => 'Redwood Valley Reserve, Seattle',
                'image_path' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Sports',
            ],
            [
                'title' => 'Deep Meditation, Mindfulness & Yoga Retreat',
                'description' => 'Align your mind and body. This retreat features guided mindfulness meditation, slow Vinyasa yoga flows, organic tea sessions, and expert mental well-being advice.',
                'event_date' => '2026-08-10',
                'event_time' => '08:00:00',
                'location' => 'Serenity Zen Gardens, Denver',
                'image_path' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Workshops',
            ],
            [
                'title' => 'CrossFit Championship & Fitness Expo 2026',
                'description' => 'Experience the ultimate test of speed, endurance, power, and athletic control. Register to compete in weight classes or watch premium national competitors battle for the cup.',
                'event_date' => '2026-08-15',
                'event_time' => '09:00:00',
                'location' => 'Athletic Club Stadium, Dallas',
                'image_path' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Sports',
            ],
        ];

        $seededEvents = [];
        foreach ($eventsData as $ev) {
            $catId = $categories[$ev['category_name']]->id;
            $seededEvents[] = Event::create([
                'title' => $ev['title'],
                'slug' => Str::slug($ev['title']),
                'description' => $ev['description'],
                'event_date' => $ev['event_date'],
                'event_time' => $ev['event_time'],
                'location' => $ev['location'],
                'image_path' => $ev['image_path'],
                'status' => $ev['status'],
                'category_id' => $catId,
                'created_by' => $organizer1->id,
            ]);
        }

        // 7. Seed Registrations (for statistics)
        // Add random registrations to events
        foreach ($seededEvents as $event) {
            // Register 5-10 random participants
            $regCount = rand(5, 10);
            $randomUsers = array_rand($mockParticipants, $regCount);
            foreach ((array)$randomUsers as $userKey) {
                EventRegistration::create([
                    'event_id' => $event->id,
                    'user_id' => $mockParticipants[$userKey]->id,
                ]);
            }
        }

        // 8. Seed Certificates (for statistics)
        // Issue certificates for the first event
        for ($i = 0; $i < 5; $i++) {
            Certificate::create([
                'event_id' => $seededEvents[0]->id,
                'user_id' => $mockParticipants[$i]->id,
                'certificate_code' => 'CERT-' . strtoupper(Str::random(8)),
            ]);
        }

        // 9. Seed Settings: Footer Brand & Contact Information
        Setting::setValue('footer_brand_title', 'EVENTRA');
        Setting::setValue('footer_brand_desc', 'Eventra is a premium event discovery and milestone tracking platform designed to help communities gather, network, and grow.');
        Setting::setValue('footer_brand_copyright', '© 2026 Eventra. All rights reserved.');
        Setting::setValue('footer_brand_logo', '/assets/logo.png');

        Setting::setValue('footer_contact_global_heading', 'Global Headquarters');
        Setting::setValue('footer_contact_global_phone', '+1 (555) 019-9000');
        Setting::setValue('footer_contact_global_email', 'global@eventra.com');

        Setting::setValue('footer_contact_bd_heading', 'Bangladesh Office');
        Setting::setValue('footer_contact_bd_phone', '+880 (2) 555-0129');
        Setting::setValue('footer_contact_bd_email', 'support.bd@eventra.com');

        // 10. Seed Footer Links
        $supportLinks = [
            ['name' => 'Help Center / FAQs', 'url' => '/help', 'order' => 1],
            ['name' => 'Contact Us', 'url' => '/contact-us', 'order' => 2],
            ['name' => 'Terms & Conditions', 'url' => '/terms', 'order' => 3],
            ['name' => 'Privacy Policy', 'url' => '/privacy', 'order' => 4],
            ['name' => 'Refund Policy', 'url' => '/refund', 'order' => 5],
        ];

        foreach ($supportLinks as $l) {
            FooterLink::create([
                'type' => 'support',
                'name' => $l['name'],
                'url' => $l['url'],
                'display_order' => $l['order'],
                'is_active' => true,
            ]);
        }

        $eventraLinks = [
            ['name' => 'About Us', 'url' => '/about-us', 'order' => 1],
            ['name' => 'Blog', 'url' => '/blog', 'order' => 2],
            ['name' => 'How It Works', 'url' => '/how-it-works', 'order' => 3],
            ['name' => 'Explore Events', 'url' => '/events', 'order' => 4],
        ];

        foreach ($eventraLinks as $l) {
            FooterLink::create([
                'type' => 'eventra',
                'name' => $l['name'],
                'url' => $l['url'],
                'display_order' => $l['order'],
                'is_active' => true,
            ]);
        }
    }
}
