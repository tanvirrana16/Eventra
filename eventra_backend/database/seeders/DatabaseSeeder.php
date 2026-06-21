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
        $admin = User::updateOrCreate(
            ['email' => 'admin@eventra.com'],
            [
                'name' => 'Eventra Admin',
                'phone' => '+8801712345678',
                'role' => 'admin',
                'status' => 'approved',
                'password' => Hash::make('password123'),
                'api_token' => 'MOCK_JWT_TOKEN_admin_token_123',
            ]
        );
 
        $organizer1 = User::updateOrCreate(
            ['email' => 'organizer@eventra.com'],
            [
                'name' => 'Eventra Team',
                'phone' => '+8801812345678',
                'role' => 'organizer',
                'status' => 'approved',
                'organization_name' => 'Eventra Global Corp',
                'contact_info' => 'contact@eventra.com',
                'password' => Hash::make('password123'),
                'api_token' => 'MOCK_JWT_TOKEN_organizer_token_123',
            ]
        );
 
        $organizer2 = User::updateOrCreate(
            ['email' => 'pending@eventra.com'],
            [
                'name' => 'Pending Host',
                'phone' => '+8801912345678',
                'role' => 'organizer',
                'status' => 'pending',
                'organization_name' => 'Future Events Group',
                'contact_info' => 'info@futureevents.org',
                'password' => Hash::make('password123'),
                'api_token' => 'MOCK_JWT_TOKEN_organizer_pending_123',
            ]
        );
 
        $participant = User::updateOrCreate(
            ['email' => 'participant@eventra.com'],
            [
                'name' => 'Tanvir Rana',
                'phone' => '+8801512345678',
                'role' => 'participant',
                'status' => 'approved',
                'interests' => 'Design, Coding, Tech',
                'location' => 'Dhaka, Bangladesh',
                'password' => Hash::make('password123'),
                'api_token' => 'MOCK_JWT_TOKEN_participant_token_123',
            ]
        );
 
        // Create 20 more mock participants for registration stats
        $mockParticipants = [];
        for ($i = 1; $i <= 20; $i++) {
            $mockParticipants[] = User::updateOrCreate(
                ['email' => "user$i@example.com"],
                [
                    'name' => "Mock User $i",
                    'phone' => "+1 555-01" . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'role' => 'participant',
                    'status' => 'approved',
                    'password' => Hash::make('password123'),
                    'api_token' => 'MOCK_JWT_TOKEN_mock_user_' . $i,
                ]
            );
        }
 
        // 2. Seed Hero Section Settings
        Setting::setValue('hero_title', 'Discover Local Events, Meet New Communities');
        Setting::setValue('hero_subtitle', 'Discover exciting events happening around you—from workshops, seminars, hackathons, networking sessions, cultural festivals, and community meetups. Connect with like-minded people, expand your network, learn new skills, and create unforgettable experiences with Eventra.');
        Setting::setValue('hero_btn1_text', 'Explore Events');
        Setting::setValue('hero_btn1_url', '/events');
        Setting::setValue('hero_btn2_text', 'Host Event');
        Setting::setValue('hero_btn2_url', '/signup');
 
        // 3. Seed Hero Slides
        HeroSlide::updateOrCreate(
            ['title' => 'Tech Summit 2026'],
            [
                'image_path' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                'description' => 'Join the biggest developer summit of the year.',
                'link' => '/events',
                'display_order' => 1,
                'is_active' => true,
            ]
        );
        HeroSlide::updateOrCreate(
            ['title' => 'Design Workshop'],
            [
                'image_path' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
                'description' => 'Master UI/UX with professional Figma design grids.',
                'link' => '/events',
                'display_order' => 2,
                'is_active' => true,
            ]
        );
 
        // 4. Seed Reusable Page Heroes
        PageHero::updateOrCreate(
            ['page' => 'events'],
            [
                'title' => 'Explore Events',
                'subtitle' => 'Discover amazing events happening in your local community, meet new people, verify graduation certificates, and upgrade your technical skills. From rock concerts and sports tournaments to technology hackathons and corporate seminars, Eventra hosts a universe of opportunities at your fingertips.',
                'background_color' => '#0C3B2E',
            ]
        );
        PageHero::updateOrCreate(
            ['page' => 'services'],
            [
                'title' => 'Professional Event Management',
                'subtitle' => 'From intimate family celebrations to large-scale corporate conferences and concerts, Eventra provides complete, high-end event management solutions tailored to your unique requirements. We orchestrate every single detail—venue bookings, schedules, AV logistics, and decoration—so you can focus on enjoying your guests.',
                'background_color' => '#0C3B2E',
            ]
        );
        PageHero::updateOrCreate(
            ['page' => 'certificate-verification'],
            [
                'title' => 'Certificate Verification',
                'subtitle' => 'Verify the authenticity of your Eventra participation certificates quickly and securely. Enter your Certificate ID below to confirm its validity.',
                'background_color' => '#0C3B2E',
            ]
        );
        PageHero::updateOrCreate(
            ['page' => 'about-us'],
            [
                'title' => 'About Eventra',
                'subtitle' => 'Connecting people through meaningful events. Eventra helps individuals, communities, universities, startups, and organizations discover, organize, and experience memorable events with ease. We believe that every gathering creates a gateway to expand knowledge, build connections, and create growth pathways.',
                'background_color' => '#0C3B2E',
            ]
        );
        PageHero::updateOrCreate(
            ['page' => 'contact-us'],
            [
                'title' => 'Contact Us',
                'subtitle' => "Have a question, need support, or want to collaborate with Eventra? We'd love to hear from you. Reach out to our team, and we'll get back to you as soon as possible. Our technical customer support agents are ready to assist you.",
                'background_color' => '#0C3B2E',
            ]
        );
 
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
            $categories[$cat['name']] = Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'icon_name' => $cat['icon_name'],
                ]
            );
        }
 
        // 6. Seed Events
        $eventsData = [
            [
                'title' => 'Global Tech Summit & Developer Convention 2026',
                'description' => 'Connect with tech leaders, developers, and creators globally. Topics include Next-Gen Web, Artificial Intelligence, Blockchain systems, and Quantum computing. Gain valuable insights from panel discussions and networking sessions.',
                'event_date' => '2026-06-28',
                'event_time' => '09:00:00',
                'event_end_date' => '2026-06-28',
                'event_end_time' => '17:00:00',
                'location' => 'Convention Center Hall A, New York',
                'image_path' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Conferences',
                'seats_left' => 12,
                'total_seats' => 100,
                'ticket_type' => 'paid',
                'ticket_price' => 49.99,
                'rating' => 5.00,
                'gallery' => [
                    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Dr. Sarah Jenkins',
                        'designation' => 'AI Research Lead',
                        'organization' => 'Google',
                        'biography' => 'Dr. Sarah Jenkins leads Google\'s advanced artificial intelligence and deep neural networking team. She holds a Ph.D. in Computer Science from MIT and has published over 45 academic papers on machine learning ethics and natural language models.',
                        'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#', 'twitter' => '#']
                    ],
                    [
                        'name' => 'Marcus Vance',
                        'designation' => 'CTO',
                        'organization' => 'FutureTech Solutions',
                        'biography' => 'Marcus Vance is the CTO at FutureTech Solutions, driving architectural scaling and blockchain ledger integrations. Formerly a senior developer at Stripe and Microsoft.',
                        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#', 'github' => '#']
                    ]
                ],
                'tags' => ['music', 'live', 'concert', 'performance', 'rock', 'jazz', 'dance'],
                'rules' => [
                    'Bring a valid ID card.',
                    'Registration is non-transferable.',
                    'No refunds after registration.',
                    'Follow event guidelines.'
                ]
            ],
            [
                'title' => 'UI/UX & Creative Product Design Masterclass',
                'description' => 'Learn the core fundamentals of UX research, layout grids, visual hierarchy, mobile typography, and advanced micro-interaction prototyping in Figma from an industry expert.',
                'event_date' => '2026-07-05',
                'event_time' => '10:00:00',
                'event_end_date' => '2026-07-05',
                'event_end_time' => '16:00:00',
                'location' => 'Creative Design Hub, San Francisco',
                'image_path' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Workshops',
                'seats_left' => 8,
                'total_seats' => 30,
                'ticket_type' => 'paid',
                'ticket_price' => 29.99,
                'rating' => 4.80,
                'gallery' => [
                    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Elena Rostova',
                        'designation' => 'Principal Product Designer',
                        'organization' => 'Airbnb',
                        'biography' => 'Elena Rostova is a Principal Product Designer at Airbnb, focusing on the future of travel and shared experiences. She hosts Figma masterclasses worldwide.',
                        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#', 'twitter' => '#']
                    ]
                ],
                'tags' => ['learning', 'workshop', 'design', 'coding', 'masterclass', 'tech', 'figma'],
                'rules' => [
                    'Figma account required.',
                    'Bring your own laptop.',
                    'Registration is non-transferable.'
                ]
            ],
            [
                'title' => 'SaaS Startup Pitch & Venture Investor Meetup',
                'description' => 'Pitch your early-stage SaaS startup directly to active angel investors and VC partners. Get immediate structural feedback and explore investment opportunities. Networking drinks included.',
                'event_date' => '2026-07-12',
                'event_time' => '16:00:00',
                'event_end_date' => '2026-07-12',
                'event_end_time' => '20:00:00',
                'location' => 'Venture Capital Tower, Chicago',
                'image_path' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Conferences',
                'seats_left' => 15,
                'total_seats' => 50,
                'ticket_type' => 'free',
                'ticket_price' => 0.00,
                'rating' => 4.90,
                'gallery' => [
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'David Chen',
                        'designation' => 'Managing Partner',
                        'organization' => 'Sequoia Lite',
                        'biography' => 'David Chen is a Managing Partner at Sequoia Lite, focusing on pre-seed and seed stage SaaS startup funding. He has guided over 12 unicorns from concept to scale.',
                        'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#', 'github' => '#']
                    ]
                ],
                'tags' => ['competition', 'hackathon', 'gaming', 'robotics', 'pitch', 'championship', 'awards'],
                'rules' => [
                    'Pitch deck must be submitted 24 hours prior.',
                    'Covers entry and networking drinks.'
                ]
            ],
            [
                'title' => 'Sustainable Green Energy Solutions Summit',
                'description' => 'Explore the latest developments in carbon reduction, grid optimization, domestic solar panel systems, wind storage generators, and sustainable lithium battery recycling schemes.',
                'event_date' => '2026-07-18',
                'event_time' => '11:00:00',
                'event_end_date' => '2026-07-18',
                'event_end_time' => '18:00:00',
                'location' => 'Eco-Park Civic Auditorium, Austin',
                'image_path' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Conferences',
                'seats_left' => 22,
                'total_seats' => 150,
                'ticket_type' => 'free',
                'ticket_price' => 0.00,
                'rating' => 4.70,
                'gallery' => [
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Prof. Alan Vance',
                        'designation' => 'Professor of Ecology',
                        'organization' => 'Stanford University',
                        'biography' => 'Prof. Alan Vance directs the Green Energy Lab at Stanford. His research focuses on smart grids and local wind power generation units.',
                        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#']
                    ]
                ],
                'tags' => ['conference', 'summit', 'keynote', 'networking', 'industry', 'panel', 'business'],
                'rules' => [
                    'Follow guidelines.',
                    'Masks recommended inside the hall.'
                ]
            ],
            [
                'title' => 'Creative Writing Workshop & Poetry Slam Night',
                'description' => 'Unleash your inner author! Learn structural editing, character framing, narrative voice building, and perform live poetry slams in a cozy local creative hub.',
                'event_date' => '2026-07-25',
                'event_time' => '18:00:00',
                'event_end_date' => '2026-07-25',
                'event_end_time' => '22:00:00',
                'location' => 'The Writer\'s Coffee Lounge, Portland',
                'image_path' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Workshops',
                'seats_left' => 10,
                'total_seats' => 40,
                'ticket_type' => 'free',
                'ticket_price' => 0.00,
                'rating' => 4.60,
                'gallery' => [
                    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Clara Bennett',
                        'designation' => 'Author & Poet',
                        'organization' => 'Freelance',
                        'biography' => 'Clara Bennett is an award-winning poet and fiction author. She helps aspiring writers find their voice through regular interactive workshops.',
                        'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['twitter' => '#']
                    ]
                ],
                'tags' => ['learning', 'workshop', 'design', 'coding', 'masterclass', 'tech', 'figma'],
                'rules' => [
                    'Original poetry only.',
                    'Respect other performers.'
                ]
            ],
            [
                'title' => 'Urban Hiking & Wilderness Photography Expedition',
                'description' => 'Discover nature photography techniques like exposure brackets, raw depth fields, composition scales, and golden-hour edits while hiking Seattle\'s premium canyon trails.',
                'event_date' => '2026-08-02',
                'event_time' => '07:00:00',
                'event_end_date' => '2026-08-02',
                'event_end_time' => '13:00:00',
                'location' => 'Redwood Valley Reserve, Seattle',
                'image_path' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Sports',
                'seats_left' => 6,
                'total_seats' => 20,
                'ticket_type' => 'paid',
                'ticket_price' => 15.00,
                'rating' => 4.95,
                'gallery' => [
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Jason Brooks',
                        'designation' => 'National Geographic Contributor',
                        'organization' => 'National Geographic',
                        'biography' => 'Jason Brooks has spent 15 years capturing wilderness settings. His frames focus on high-contrast sunrise environments and natural preservation.',
                        'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#', 'instagram' => '#']
                    ]
                ],
                'tags' => ['sports', 'fitness', 'athletics', 'game', 'match', 'championship', 'running'],
                'rules' => [
                    'Bring comfortable hiking shoes.',
                    'Bring your own DSLR/Mirrorless camera.'
                ]
            ],
            [
                'title' => 'Deep Meditation, Mindfulness & Yoga Retreat',
                'description' => 'Align your mind and body. This retreat features guided mindfulness meditation, slow Vinyasa yoga flows, organic tea sessions, and expert mental well-being advice.',
                'event_date' => '2026-08-10',
                'event_time' => '08:00:00',
                'event_end_date' => '2026-08-10',
                'event_end_time' => '12:00:00',
                'location' => 'Serenity Zen Gardens, Denver',
                'image_path' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Workshops',
                'seats_left' => 18,
                'total_seats' => 25,
                'ticket_type' => 'paid',
                'ticket_price' => 35.00,
                'rating' => 4.85,
                'gallery' => [
                    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Swara Devi',
                        'designation' => 'Yoga Therapist',
                        'organization' => 'Mindfulness Institute',
                        'biography' => 'Swara Devi is a certified mental wellness coach and yoga practitioner specializing in Hatha and slow-flow Vinyasa techniques.',
                        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['linkedin' => '#']
                    ]
                ],
                'tags' => ['learning', 'workshop', 'design', 'coding', 'masterclass', 'tech', 'figma'],
                'rules' => [
                    'Bring your own yoga mat.',
                    'Maintain silence during sessions.'
                ]
            ],
            [
                'title' => 'CrossFit Championship & Fitness Expo 2026',
                'description' => 'Experience the ultimate test of speed, endurance, power, and athletic control. Register to compete in weight classes or watch premium national competitors battle for the cup.',
                'event_date' => '2026-08-15',
                'event_time' => '09:00:00',
                'event_end_date' => '2026-08-15',
                'event_end_time' => '17:00:00',
                'location' => 'Athletic Club Stadium, Dallas',
                'image_path' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                'status' => 'published',
                'category_name' => 'Sports',
                'seats_left' => 35,
                'total_seats' => 200,
                'ticket_type' => 'paid',
                'ticket_price' => 10.00,
                'rating' => 4.90,
                'gallery' => [
                    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80'
                ],
                'speakers' => [
                    [
                        'name' => 'Coach Ray Hudson',
                        'designation' => 'Head Coach',
                        'organization' => 'Texas Strength Club',
                        'biography' => 'Coach Ray Hudson has trained regional powerlifters and crossfit contestants for over a decade. He champions core scaling and joint safety.',
                        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                        'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                        'social_links' => ['twitter' => '#']
                    ]
                ],
                'tags' => ['sports', 'fitness', 'athletics', 'game', 'match', 'championship', 'running'],
                'rules' => [
                    'Proper athletic attire is mandatory.',
                    'Participant waiver must be signed at entry.'
                ]
            ],
        ];
 
        $seededEvents = [];
        foreach ($eventsData as $ev) {
            $catId = $categories[$ev['category_name']]->id;
            $seededEvents[] = Event::updateOrCreate(
                ['slug' => Str::slug($ev['title'])],
                [
                    'title' => $ev['title'],
                    'description' => $ev['description'],
                    'event_date' => $ev['event_date'],
                    'event_time' => $ev['event_time'],
                    'event_end_date' => $ev['event_end_date'],
                    'event_end_time' => $ev['event_end_time'],
                    'location' => $ev['location'],
                    'image_path' => $ev['image_path'],
                    'seats_left' => $ev['seats_left'],
                    'total_seats' => $ev['total_seats'],
                    'ticket_type' => $ev['ticket_type'],
                    'ticket_price' => $ev['ticket_price'],
                    'rating' => $ev['rating'],
                    'gallery' => $ev['gallery'],
                    'speakers' => $ev['speakers'],
                    'tags' => $ev['tags'],
                    'rules' => $ev['rules'],
                    'status' => $ev['status'],
                    'category_id' => $catId,
                    'created_by' => $organizer1->id,
                ]
            );
        }
 
        // 7. Seed Registrations (for statistics)
        // Add random registrations to events
        foreach ($seededEvents as $event) {
            $regCount = rand(5, 10);
            $randomUsers = array_rand($mockParticipants, $regCount);
            foreach ((array)$randomUsers as $userKey) {
                EventRegistration::firstOrCreate([
                    'event_id' => $event->id,
                    'user_id' => $mockParticipants[$userKey]->id,
                ]);
            }
        }
 
        // 8. Seed Certificates (for statistics)
        // Issue certificates for the first event
        for ($i = 0; $i < 5; $i++) {
            Certificate::firstOrCreate(
                ['user_id' => $mockParticipants[$i]->id, 'event_id' => $seededEvents[0]->id],
                ['certificate_code' => 'CERT-' . strtoupper(Str::random(8))]
            );
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
            FooterLink::updateOrCreate(
                ['type' => 'support', 'name' => $l['name']],
                [
                    'url' => $l['url'],
                    'display_order' => $l['order'],
                    'is_active' => true,
                ]
            );
        }
 
        $eventraLinks = [
            ['name' => 'About Us', 'url' => '/about-us', 'order' => 1],
            ['name' => 'Blog', 'url' => '/blog', 'order' => 2],
            ['name' => 'How It Works', 'url' => '/how-it-works', 'order' => 3],
            ['name' => 'Explore Events', 'url' => '/events', 'order' => 4],
        ];
 
        foreach ($eventraLinks as $l) {
            FooterLink::updateOrCreate(
                ['type' => 'eventra', 'name' => $l['name']],
                [
                    'url' => $l['url'],
                    'display_order' => $l['order'],
                    'is_active' => true,
                ]
            );
        }

        // 11. Seed dynamic settings data for frontend pages
        // About Us Page Datasets
        $teamMembers = [
            [
                'name' => 'Alexander Vance',
                'role' => 'Founder & CEO',
                'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80',
                'bio' => 'Visionary entrepreneur with 10+ years managing large-scale global event technologies. Driven by connecting people through innovation.',
                'socials' => ['linkedin' => '#', 'twitter' => '#', 'github' => '#']
            ],
            [
                'name' => 'Elena Rostova',
                'role' => 'Project Manager',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80',
                'bio' => 'Certified Scrum Master ensuring timeline enforcement, vendor compliance, and seamless on-day management checklists.',
                'socials' => ['linkedin' => '#', 'twitter' => '#', 'facebook' => '#']
            ],
            [
                'name' => 'Sarah Jenkins',
                'role' => 'UI/UX Lead Designer',
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
                'bio' => 'Passionate about building highly intuitive, premium user experiences and layout grids that make event discovery enjoyable.',
                'socials' => ['linkedin' => '#', 'twitter' => '#']
            ],
            [
                'name' => 'Marcus Cole',
                'role' => 'Lead Frontend Developer',
                'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80',
                'bio' => 'Vite and React specialist crafting smooth micro-interactions, responsive CSS components, and highly accessible structures.',
                'socials' => ['linkedin' => '#', 'github' => '#', 'twitter' => '#']
            ]
        ];
        Setting::setValue('about_us_team_members', json_encode($teamMembers));

        $chooseFeatures = [
            ['title' => 'Modern Event Management', 'desc' => 'Easily organize events from a unified portal with smart settings and layout customization.', 'icon' => 'Settings'],
            ['title' => 'Easy Event Discovery', 'desc' => 'Instantly filter events based on tags, categories, live status, and physical location.', 'icon' => 'Search'],
            ['title' => 'Secure Registration', 'desc' => 'High-grade registration forms and payment portals keeping client details completely private.', 'icon' => 'ShieldCheck'],
            ['title' => 'Digital Certificates', 'desc' => 'Secure cryptographic certificate generation validating participant achievements instantly.', 'icon' => 'Award'],
            ['title' => 'Professional Support', 'desc' => 'Our coordination helpdesk operates 24/7 assisting organizers with logistics setup.', 'icon' => 'MessageSquare'],
            ['title' => 'Smart Event Analytics', 'desc' => 'Track attendees, ticket sales, registration trends, and feedback ratings in real-time.', 'icon' => 'LineChart'],
            ['title' => 'Responsive Platform', 'desc' => 'Optimized mobile drawer viewports and fluid designs suitable for any size device screen.', 'icon' => 'Laptop'],
            ['title' => 'Trusted by Communities', 'desc' => 'Active integration networks with university clubs, tech communities, and corporate brands.', 'icon' => 'Users']
        ];
        Setting::setValue('about_us_choose_features', json_encode($chooseFeatures));

        $aboutUsTimeline = [
            ['year' => '2025', 'title' => 'Idea Born', 'desc' => 'Eventra project conceived to build an unified event coordinator platform.', 'icon' => 'Lightbulb'],
            ['year' => '2026', 'title' => 'Official Launch', 'desc' => 'Version 1.0 released globally with instant search and ticket registry systems.', 'icon' => 'Zap'],
            ['year' => '2026', 'title' => 'Community Growth', 'desc' => 'Hosted over 100+ community meets and deployed secure digital certificate systems.', 'icon' => 'Trophy'],
            ['year' => 'Future', 'title' => 'Global Expansion', 'desc' => 'Integrating automated AI matchmaking and expanding corporate events portfolios.', 'icon' => 'Globe']
        ];
        Setting::setValue('about_us_timeline_steps', json_encode($aboutUsTimeline));

        $partners = [
            ['name' => 'Apex University', 'logoText' => 'APEX', 'desc' => 'Academic Partner'],
            ['name' => 'Delta Startups', 'logoText' => 'DELTA', 'desc' => 'Startup Ecosystem'],
            ['name' => 'Zenith Corp', 'logoText' => 'ZENITH', 'desc' => 'Corporate Sponsor'],
            ['name' => 'Omni Media', 'logoText' => 'OMNI', 'desc' => 'Media Broadcaster'],
            ['name' => 'NextTech', 'logoText' => 'NEXT', 'desc' => 'Tech Incubator'],
            ['name' => 'Genesis Lab', 'logoText' => 'GENESIS', 'desc' => 'Research Partner']
        ];
        Setting::setValue('about_us_partners', json_encode($partners));

        $aboutUsTestimonials = [
            [
                'name' => 'Professor Albert Sterling',
                'org' => 'Dean of Computer Science at Stanford',
                'photo' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
                'rating' => 5,
                'review' => 'Eventra made organizing our university tech conference effortless. The platform is intuitive, reliable, and professional. The digital certificate generation was highly appreciated by the students.'
            ],
            [
                'name' => 'Clara Oswald',
                'org' => 'Co-Founder of Zenith Tech Meetups',
                'photo' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
                'rating' => 5,
                'review' => 'As an event organizer, tracking registrations used to be a nightmare. Deployed Eventra for our tech hackathon and the experience was absolute bliss. Dynamic check-ins ran without a lag.'
            ],
            [
                'name' => 'Julian Sterling',
                'org' => 'Director of HR at Nexa Corp',
                'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                'rating' => 5,
                'review' => 'The annual corporate team camp we hosted using Eventra was coordinated flawlessly. The scheduling flows and feedback analytics gave us key insights into team engagement.'
            ]
        ];
        Setting::setValue('about_us_testimonials', json_encode($aboutUsTestimonials));

        $aboutUsFaq = [
            ['question' => 'What is Eventra?', 'answer' => 'Eventra is a modern, premium event management platform built to simplify event discovery, registration, scheduling, and digital certificate verification. We serve communities, corporate groups, startups, and academic groups alike.'],
            ['question' => 'How do I create an event?', 'answer' => 'You can create an event by registering an Organizer profile. Once approved by our compliance review team, you will receive full access to our dashboard to draft schedules, customize landing pages, upload maps, and track invites.'],
            ['question' => 'Is Eventra free to use?', 'answer' => 'Eventra offers a free tier for community meetups and standard local events. For premium features such as sound/lighting equipment bookings, custom LED rendering, certificate generation, or payment portals, we offer flexible subscription packages.'],
            ['question' => 'Can organizations use Eventra?', 'answer' => 'Absolutely! Eventra has a dedicated organizational suite built to handle high-volume user traffic, VIP scheduling, sponsor banners, multiple on-site coordinators, and detailed post-event analytical spreadsheets.'],
            ['question' => 'How do certificate verification and registration work?', 'answer' => 'When a participant completes an event, a unique Certificate ID is registered in our database. The participant receives a digital link. Anyone can verify this link or input the Certificate ID on our Certificate Verification page to retrieve instant registry validation.'],
            ['question' => 'How can I become a partner?', 'answer' => 'We welcome partnerships with universities, corporate sponsors, tech incubators, and media networks. Click the \'Contact Us\' button in our call-to-action banner below, or reach out to partners@eventra.com to request collaboration terms.']
        ];
        Setting::setValue('about_us_faq_items', json_encode($aboutUsFaq));

        $aboutUsStats = [
            ['count' => 100, 'label' => 'Events Organized', 'suffix' => '+', 'color' => 'text-indigo-600 bg-indigo-50 border-indigo-100'],
            ['count' => 10000, 'label' => 'Participants Connected', 'suffix' => '+', 'color' => 'text-emerald-700 bg-emerald-50 border-emerald-100'],
            ['count' => 150, 'label' => 'Registered Organizers', 'suffix' => '+', 'color' => 'text-amber-700 bg-amber-50 border-amber-100'],
            ['count' => 98, 'label' => 'Satisfaction Rate', 'suffix' => '%', 'color' => 'text-rose-600 bg-rose-50 border-rose-100'],
            ['count' => 500, 'label' => 'Certificates Issued', 'suffix' => '+', 'color' => 'text-purple-600 bg-purple-50 border-purple-100'],
            ['count' => 25, 'label' => 'Partner Organizations', 'suffix' => '+', 'color' => 'text-teal-600 bg-teal-50 border-teal-100']
        ];
        Setting::setValue('about_us_stats', json_encode($aboutUsStats));

        // Services Page Datasets
        $servicesCore = [
            [
                'title' => 'Wedding Planning',
                'icon' => 'Heart',
                'gradient' => 'from-purple-500/10 to-indigo-500/5 border-purple-500/15 text-purple-700 hover:border-purple-400/40 hover:shadow-purple-500/5',
                'badgeBg' => 'bg-purple-50 text-purple-700',
                'description' => 'We manage every aspect of your wedding, including decor, guest lists, catering, and schedule planning for your special day.',
                'features' => ['Venue Selection', 'Custom Decoration', 'Catering & Menu Design', 'Guest Invitations', 'On-Day Coordination', 'Photography Setup']
            ],
            [
                'title' => 'Corporate Events',
                'icon' => 'Briefcase',
                'gradient' => 'from-amber-500/10 to-orange-500/5 border-amber-500/15 text-amber-700 hover:border-amber-400/40 hover:shadow-amber-500/5',
                'badgeBg' => 'bg-amber-50 text-amber-700',
                'description' => 'Professional corporate event organization from product launches, annual dinners, board meetups, to team-building activities.',
                'features' => ['AV Setup & Support', 'Guest Speaker booking', 'Catering & Logistics', 'Branding & Signage', 'On-Site Management', 'VIP Coordination']
            ],
            [
                'title' => 'Conferences & Seminars',
                'icon' => 'Presentation',
                'gradient' => 'from-teal-500/10 to-emerald-500/5 border-teal-500/15 text-teal-700 hover:border-teal-400/40 hover:shadow-teal-500/5',
                'badgeBg' => 'bg-teal-50 text-teal-700',
                'description' => 'Flawless seminar execution featuring high-end streaming setups, registration, speaker support, and feedback management.',
                'features' => ['Digital Registration', 'Live Streaming Setups', 'Speaker Coordination', 'Feedback Forms', 'Stage Design', 'Security Services']
            ],
            [
                'title' => 'Concert Management',
                'icon' => 'Music',
                'gradient' => 'from-purple-500/10 to-indigo-500/5 border-purple-500/15 text-purple-700 hover:border-purple-400/40 hover:shadow-purple-500/5',
                'badgeBg' => 'bg-purple-50 text-purple-700',
                'description' => 'Large scale concert logistics, including stadium booking, ticket portal integration, professional audio systems, and security.',
                'features' => ['Acoustics & Lighting', 'Ticket Portal Setup', 'Artist Management', 'Crowd Security', 'VIP Seating Deck', 'Permit Management']
            ],
            [
                'title' => 'Cultural Programs',
                'icon' => 'Tv',
                'gradient' => 'from-amber-500/10 to-orange-500/5 border-amber-500/15 text-amber-700 hover:border-amber-400/40 hover:shadow-amber-500/5',
                'badgeBg' => 'bg-amber-50 text-amber-700',
                'description' => 'Vibrant traditional and national cultural program setups featuring customized theme decor, local artists, and stage design.',
                'features' => ['Custom Stage Sets', 'Traditional Decor', 'Artist Management', 'Event Flow Control', 'Photography & Video', 'Sound Engineering']
            ],
            [
                'title' => 'Birthday Parties',
                'icon' => 'Cake',
                'gradient' => 'from-teal-500/10 to-emerald-500/5 border-teal-500/15 text-teal-700 hover:border-teal-400/40 hover:shadow-teal-500/5',
                'badgeBg' => 'bg-teal-50 text-teal-700',
                'description' => 'Creating magical birthday setups matching your customized themes, catering, entertainment shows, and cake presentation.',
                'features' => ['Theme Decoration', 'Kids Entertainment', 'Cake Setup Design', 'Photo Booths', 'Catering Services', 'Invitation Cards']
            ],
            [
                'title' => 'Startup & Tech Events',
                'icon' => 'Code',
                'gradient' => 'from-purple-500/10 to-indigo-500/5 border-purple-500/15 text-purple-700 hover:border-purple-400/40 hover:shadow-purple-500/5',
                'badgeBg' => 'bg-purple-50 text-purple-700',
                'description' => 'Hackathons, networking sessions, pitch cups, and product demos. We coordinate power backups, high-speed networks, and VC invites.',
                'features' => ['Pitch Deck Stages', 'VC Coordinator', 'High Speed Internet', 'Power Backups', 'Live Demo Zones', 'Event Promotion']
            ],
            [
                'title' => 'Sports Events',
                'icon' => 'Dumbbell',
                'gradient' => 'from-amber-500/10 to-orange-500/5 border-amber-500/15 text-amber-700 hover:border-amber-400/40 hover:shadow-amber-500/5',
                'badgeBg' => 'bg-amber-50 text-amber-700',
                'description' => 'Planning tournaments, championships, runs, or marathons. We coordinate stadium logistics, safety, and athlete badges.',
                'features' => ['Stadium Booking', 'Athlete Badges', 'Medical/Safety staff', 'Score Boards', 'Sponsorship Banners', 'Press Deck Setup']
            ],
            [
                'title' => 'Community Meetups',
                'icon' => 'Users',
                'gradient' => 'from-teal-500/10 to-emerald-500/5 border-teal-500/15 text-teal-700 hover:border-teal-400/40 hover:shadow-teal-500/5',
                'badgeBg' => 'bg-teal-50 text-teal-700',
                'description' => 'Intimate and social group gatherings. We find cozy cafes, organize discussion cards, registration tables, and catering setups.',
                'features' => ['Cafe Bookings', 'Icebreakers Cards', 'Guest Support', 'Catering & Snacks', 'Promotion Services', 'Audio Microphones']
            ]
        ];
        Setting::setValue('services_core', json_encode($servicesCore));
 
        $servicesAdditional = [
            ['name' => 'Photography & Videography', 'icon' => 'Camera'],
            ['name' => 'Catering Services', 'icon' => 'Utensils'],
            ['name' => 'Event Decoration', 'icon' => 'Paintbrush'],
            ['name' => 'Stage Design', 'icon' => 'Layers'],
            ['name' => 'Lighting Setup', 'icon' => 'Lightbulb'],
            ['name' => 'Professional Sound System', 'icon' => 'Volume2'],
            ['name' => 'DJ & Live Entertainment', 'icon' => 'Music'],
            ['name' => 'LED Display Solutions', 'icon' => 'Tv'],
            ['name' => 'Ticket Management', 'icon' => 'Tickets'],
            ['name' => 'Event Registration', 'icon' => 'FileText'],
            ['name' => 'Security Services', 'icon' => 'ShieldAlert'],
            ['name' => 'Furniture Rental', 'icon' => 'Armchair'],
            ['name' => 'Floral Decoration', 'icon' => 'Flower'],
            ['name' => 'Custom Invitation Design', 'icon' => 'PenTool']
        ];
        Setting::setValue('services_additional', json_encode($servicesAdditional));
 
        $servicesTimeline = [
            ['step' => 'Step 1', 'title' => 'Consultation', 'description' => 'We meet to understand your vision, goals, and budget constraints.', 'icon' => 'MessageSquare'],
            ['step' => 'Step 2', 'title' => 'Planning', 'description' => 'Our team designs a detailed roadmap and secures top-tier resources.', 'icon' => 'Calendar'],
            ['step' => 'Step 3', 'title' => 'Execution', 'description' => 'We bring the plan to life with flawless on-site coordination.', 'icon' => 'Zap'],
            ['step' => 'Step 4', 'title' => 'Successful Event', 'description' => 'Relax and enjoy a seamlessly delivered, unforgettable guest experience.', 'icon' => 'Trophy']
        ];
        Setting::setValue('services_timeline_steps', json_encode($servicesTimeline));
 
        $servicesWhyChooseUs = [
            ['title' => 'Experienced Event Managers', 'description' => 'Our certified planners have coordinated over 500+ events globally.', 'icon' => 'Users'],
            ['title' => 'Customized Event Planning', 'description' => 'Every roadmap, stage design, and decor is built tailored specifically to your needs.', 'icon' => 'PenTool'],
            ['title' => 'Transparent Pricing', 'description' => 'No hidden charges, flexible packages, and transparent quotations upfront.', 'icon' => 'DollarSign'],
            ['title' => 'Modern Equipment', 'description' => 'Utilizing top-grade audio systems, LED displays, and custom laser lighting.', 'icon' => 'Settings'],
            ['title' => 'Creative Event Concepts', 'description' => 'Innovative themes and designs that leave a lasting memory on all attendees.', 'icon' => 'Lightbulb'],
            ['title' => 'Trusted by Organizations', 'description' => 'Active partners with over 80+ top multinational corporate brands.', 'icon' => 'Award'],
            ['title' => 'Professional Team', 'description' => 'Dedicated on-site coordinators who manage all micro-logistics on event day.', 'icon' => 'ShieldCheck'],
            ['title' => 'On-Time Event Execution', 'description' => 'Strict timeline compliance and prompt execution schedules.', 'icon' => 'Clock']
        ];
        Setting::setValue('services_why_choose_us', json_encode($servicesWhyChooseUs));
 
        $servicesPortfolio = [
            [
                'title' => 'Annual Tech Innovators Summit 2026',
                'category' => 'Conferences',
                'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                'location' => 'Convention Hall A, San Francisco',
                'attendees' => '1,200 Attendees',
                'date' => 'March 15, 2026'
            ],
            [
                'title' => 'Serenade Woods Luxury Wedding',
                'category' => 'Wedding Planning',
                'image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'location' => 'Whispering Pines Forest, Oregon',
                'attendees' => '350 Guests',
                'date' => 'May 28, 2026'
            ],
            [
                'title' => 'Neon Horizon Music & Arts Fest',
                'category' => 'Concerts',
                'image' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                'location' => 'Riverfront Arena Amphitheatre',
                'attendees' => '8,500 Attendees',
                'date' => 'June 05, 2026'
            ]
        ];
        Setting::setValue('services_portfolio_projects', json_encode($servicesPortfolio));
 
        $servicesPricing = [
            [
                'name' => 'Basic',
                'price' => '$1,500',
                'suitable' => 'Suitable for small events',
                'features' => [
                    'Initial Event Planning & Strategy',
                    'Standard Backdrop & Stage Decor',
                    'Basic Photography (4 hours coverage)',
                    'Standard Guest Support Check-in',
                    'Catering Vendor Selection Support'
                ],
                'buttonText' => 'Choose Plan',
                'popular' => false
            ],
            [
                'name' => 'Professional',
                'price' => '$4,500',
                'suitable' => 'Suitable for medium-sized events',
                'features' => [
                    'Premium Stage Backdrop & Theme Decor',
                    'High-Res Photography & Videography',
                    'Full Catering Logistics Coordination',
                    'Stage Lighting & Basic Sound Setup',
                    'Digital Invites & RSVP Management',
                    '2 Dedicated On-Site Coordinators'
                ],
                'buttonText' => 'Choose Plan',
                'popular' => true
            ],
            [
                'name' => 'Enterprise',
                'price' => '$10,000',
                'suitable' => 'Suitable for large corporate events',
                'features' => [
                    'Dedicated Full-Time Event Director',
                    'Custom Visual 3D Stage Rendering',
                    'VIP/Premium Guest Care Services',
                    'High-Grade Security & Crowd Management',
                    'LED Screen & Professional Sound Arrays',
                    'Live Streaming & AV Setup',
                    'Custom End-to-End Solutions'
                ],
                'buttonText' => 'Contact Sales',
                'popular' => false
            ]
        ];
        Setting::setValue('services_pricing_packages', json_encode($servicesPricing));
 
        $servicesTestimonials = [
            [
                'name' => 'Rachel Morrison',
                'org' => 'VP of Operations at Google Cloud',
                'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
                'rating' => 5,
                'review' => 'Eventra managed our annual tech conference flawlessly. The team was highly professional, incredibly organized, and exceeded all our expectations from scheduling down to stage setups.'
            ],
            [
                'name' => 'Michael Chen',
                'org' => 'Founder of Delta Startups',
                'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                'rating' => 5,
                'review' => 'The pitch cup and mixer organized by Eventra was a massive success! Their AV support was perfect, internet speed ran smoothly, and on-site logistics went without a single issue.'
            ],
            [
                'name' => 'Sophie & Daniel',
                'org' => 'Married Couples',
                'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
                'rating' => 5,
                'review' => 'Our wedding decor and execution were absolutely magical. Eventra handled all guest check-ins, food coordinate timings, and decor layout exactly as we had designed in the roadmaps.'
            ]
        ];
        Setting::setValue('services_testimonials', json_encode($servicesTestimonials));
 
        $servicesFaq = [
            ['question' => 'How do I book an event management service?', 'answer' => 'You can book by clicking the \'Book a Service\' button in our hero section or navigating to our Contact page. Our executive event planners will set up an online video call to draft initial proposals.'],
            ['question' => 'Can I customize my package?', 'answer' => 'Absolutely! All basic, professional, and enterprise plans serve as structured guides. We customize every detail—decoration themes, speaker decks, permits, catering—to match your exact target goals.'],
            ['question' => 'Do you organize corporate events?', 'answer' => 'Yes, corporate events are one of our core specialties. We host conferences, seminars, stakeholder meetups, team-building camps, and formal award dinners.'],
            ['question' => 'Do you provide catering services?', 'answer' => 'While we do not prepare food directly in-house, we coordinate directly with elite, licensed local catering vendors. We draft menus, sample food quality, and direct catering serving timelines.'],
            ['question' => 'How early should I book?', 'answer' => 'For large conferences, weddings, or concerts, we highly recommend booking at least 3 to 6 months in advance. For minor workshops, startup mixers, or birthday parties, 1 month is generally sufficient.'],
            ['question' => 'Can you manage university events?', 'answer' => 'Yes, we coordinate university convocations, talent sports cups, and tech hackathons. We offer discounted pricing models specifically for academic institutions.'],
            ['question' => 'What payment methods do you accept?', 'answer' => 'We accept bank wire transfers, major credit cards, mobile wallets, and corporate cheques. Payments are generally structured in a 50% booking advance and a 50% post-event clearance format.'],
            ['question' => 'Can I cancel or reschedule my booking?', 'answer' => 'Yes. Cancelations up to 30 days before the event receive full refunds minus deposits. Rescheduling is free of charge up to 15 days prior, subject to venue availability.']
        ];
        Setting::setValue('services_faq_items', json_encode($servicesFaq));
 
        // Contact Us Page Datasets
        $contactInfo = [
            ['title' => 'Email Us', 'details' => ['hello@eventra.live', 'support@eventra.live'], 'icon' => 'Mail', 'color' => 'text-indigo-600 bg-indigo-50 border-indigo-100'],
            ['title' => 'Call Us', 'details' => ['+880 1703-916173', '+1 (323) 772-8781'], 'icon' => 'Phone', 'color' => 'text-emerald-700 bg-emerald-50 border-emerald-100'],
            ['title' => 'Our Office', 'details' => ['Barishal, Bangladesh', 'Open Monday–Friday', '9:00 AM – 6:00 PM'], 'icon' => 'MapPin', 'color' => 'text-amber-700 bg-amber-50 border-amber-100'],
            ['title' => 'Working Hours', 'details' => ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 2:00 PM', 'Sunday: Closed'], 'icon' => 'Clock', 'color' => 'text-rose-600 bg-rose-50 border-rose-100']
        ];
        Setting::setValue('contact_info', json_encode($contactInfo));
 
        // Certificate Verification Page Datasets
        $certFaq = [
            ['question' => 'Where can I find my Certificate ID?', 'answer' => 'Your Certificate ID is located at the bottom-left corner of the certificate document issued to you via email after the event completion. It typically follows the format EVT-2026-XXXXXX.'],
            ['question' => 'How do I verify my certificate?', 'answer' => 'Simply input your Certificate ID in the field above and click \'Verify Certificate\'. Alternatively, upload a photo/PDF of your certificate or QR code in the drag-and-drop zone.'],
            ['question' => 'Why is my certificate not showing?', 'answer' => 'Verification records can take up to 24 hours after event completion to appear. If your event ended recently, please check back soon. Ensure that you have typed the ID correctly, including hyphens.'],
            ['question' => 'Can I download my certificate again?', 'answer' => 'Yes! Once your certificate is successfully verified above, a \'Download Certificate\' action button will appear, allowing you to save it directly as a high-quality PDF.'],
            ['question' => 'Is QR code verification supported?', 'answer' => 'Yes, the interface supports uploading QR code images. Automated instant scanning and verification will be fully active upon backend integration.'],
            ['question' => 'Who should I contact if verification fails?', 'answer' => 'If you believe there is an error in our database or your name is spelled incorrectly, please click the \'Contact Support\' button below or email us directly at support@eventra.com.']
        ];
        Setting::setValue('certificate_verification_faq_items', json_encode($certFaq));
    }
}
