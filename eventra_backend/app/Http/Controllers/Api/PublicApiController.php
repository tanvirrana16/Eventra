<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Certificate;
use App\Models\FooterLink;
use App\Models\HeroSlide;
use App\Models\PageHero;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    /**
     * Get all content required to render the dynamic homepage.
     */
    public function getHomepage()
    {
        // 1. Hero Left Side Settings
        $hero = [
            'title' => Setting::getValue('hero_title', 'Discover Local Events, Meet New Communities'),
            'subtitle' => Setting::getValue('hero_subtitle', ''),
            'btn1_text' => Setting::getValue('hero_btn1_text', 'Explore Events'),
            'btn1_url' => Setting::getValue('hero_btn1_url', '/events'),
            'btn2_text' => Setting::getValue('hero_btn2_text', 'Host Event'),
            'btn2_url' => Setting::getValue('hero_btn2_url', '/signup'),
        ];

        // 2. Hero Right Side Slider
        $slider = HeroSlide::active()->get()->map(function($slide) {
            return [
                'id' => $slide->id,
                'image' => $slide->image_path,
                'title' => $slide->title,
                'description' => $slide->description,
                'link' => $slide->link,
            ];
        });

        // 3. Top 5 Categories (by published event count)
        $topCategories = Category::withCount(['events' => function($q) {
                $q->where('status', 'published');
            }])
            ->orderBy('events_count', 'desc')
            ->take(5)
            ->get()
            ->map(function($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'icon' => $cat->icon_name,
                    'events_count' => $cat->events_count,
                ];
            });

        // 4. Latest 4 Published Events
        $latestEvents = Event::with(['category', 'organizer'])->latestEvents(4)->get()->map(function($event) {
            return $this->formatEventCard($event);
        });

        // 5. Upcoming 4 Published Events
        $upcomingEvents = Event::with(['category', 'organizer'])->upcomingEvents(4)->get()->map(function($event) {
            return $this->formatEventCard($event);
        });

        // 6. Statistics Counter (lifetime events, total registrations, approved hosts, generated certificates)
        $stats = [
            'total_events' => Event::count(), // Lifetime events
            'participants' => EventRegistration::count(), // Total registrations
            'organizers' => User::where('role', 'organizer')->where('status', 'approved')->count(), // Approved hosts
            'certificates' => Certificate::count(), // Generated certificates
        ];

        // 7. Footer
        $footer = [
            'brand' => [
                'title' => Setting::getValue('footer_brand_title', 'EVENTRA'),
                'description' => Setting::getValue('footer_brand_desc', ''),
                'logo' => Setting::getValue('footer_brand_logo', '/assets/logo.png'),
                'copyright' => Setting::getValue('footer_brand_copyright', '© 2026 Eventra. All rights reserved.'),
            ],
            'contact_global' => [
                'heading' => Setting::getValue('footer_contact_global_heading', 'Global Headquarter'),
                'phone' => Setting::getValue('footer_contact_global_phone', ''),
                'email' => Setting::getValue('footer_contact_global_email', ''),
            ],
            'contact_bd' => [
                'heading' => Setting::getValue('footer_contact_bd_heading', 'Bangladesh Office'),
                'phone' => Setting::getValue('footer_contact_bd_phone', ''),
                'email' => Setting::getValue('footer_contact_bd_email', ''),
            ],
            'support_links' => FooterLink::where('type', 'support')->active()->get()->map(function($link) {
                return ['name' => $link->name, 'url' => $link->url];
            }),
            'eventra_links' => FooterLink::where('type', 'eventra')->active()->get()->map(function($link) {
                return ['name' => $link->name, 'url' => $link->url];
            }),
        ];

        return response()->json([
            'hero' => $hero,
            'slider' => $slider,
            'top_categories' => $topCategories,
            'latest_events' => $latestEvents,
            'upcoming_events' => $upcomingEvents,
            'stats' => $stats,
            'footer' => $footer,
        ]);
    }

    /**
     * Fetch all published events.
     */
    public function getEvents(Request $request)
    {
        $query = Event::with(['category', 'organizer'])->published();

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $events = $query->orderBy('event_date', 'asc')->get()->map(function($event) {
            return $this->formatEventCard($event);
        });

        // Sort: Upcoming → Live → Past for better UX
        $sortOrder = ['Upcoming' => 0, 'Live' => 1, 'Past' => 2];
        $events = $events->sortBy(fn($e) => $sortOrder[$e['status']] ?? 3)->values();

        return response()->json($events);
    }

    /**
     * Get Page Hero details.
     */
    public function getPageHero($page)
    {
        $hero = PageHero::where('page', $page)->first();

        if (!$hero) {
            return response()->json(['message' => 'Hero banner configuration not found for this page.'], 404);
        }

        return response()->json([
            'page' => $hero->page,
            'title' => $hero->title,
            'subtitle' => $hero->subtitle,
            'background_image' => $hero->background_image_path,
            'background_color' => $hero->background_color,
            'cta_text' => $hero->cta_text,
            'cta_link' => $hero->cta_link,
        ]);
    }

    /**
     * Format database model into a standard JSON card matching the frontend requirements.
     */
    private function formatEventCard(Event $event)
    {
        // Parse date for badges
        $date = $event->event_date;
        $day = $date->format('d');
        $month = strtoupper($date->format('M'));

        // Dynamically calculate status based on start/end date and time
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
            $rawStatus = 'Upcoming';
            $status = 'Upcoming';
        } elseif ($now->between($start, $end)) {
            $rawStatus = 'Live';
            $status = 'Live';
        } else {
            $rawStatus = 'Past';
            $status = 'Past';
        }

        // Predefined Category to Tags map
        $categoryTags = [
            'Concert' => ['Concert', 'Music', 'Live', 'Performance', 'Show', 'Sound', 'Vibe'],
            'Sports' => ['Sports', 'Athletics', 'Game', 'Match', 'Fitness', 'Tournament', 'Championship'],
            'Workshops' => ['Workshop', 'Learning', 'Skills', 'Masterclass', 'Education', 'Training', 'Hands-on'],
            'Fundraisers' => ['Fundraiser', 'Charity', 'Donation', 'Support', 'Community', 'Cause', 'Help'],
            'Festivals' => ['Festival', 'Celebration', 'Culture', 'Food', 'Fun', 'Art', 'Holiday'],
            'Competitions' => ['Competition', 'Contest', 'Trophy', 'Battle', 'Challenge', 'Awards', 'Win'],
            'Fashion Shows' => ['Fashion', 'Show', 'Style', 'Runway', 'Design', 'Model', 'Trends'],
            'Conferences' => ['Conference', 'Networking', 'Keynote', 'Industry', 'Panel', 'Summit', 'Business'],
            'Seminars' => ['Seminar', 'Education', 'Lecture', 'Academic', 'Learning', 'Speaker', 'Research'],
            'Reunions' => ['Reunion', 'Meetup', 'Alumni', 'Gathering', 'Friends', 'Social', 'Family'],
            'Exhibitions' => ['Exhibition', 'Art', 'Gallery', 'Showcase', 'Display', 'Museum', 'Expo'],
            'Launching' => ['Launch', 'Release', 'New', 'Startup', 'Product', 'Unveiling', 'Innovation'],
            'Stand-up' => ['Stand-up', 'Comedy', 'Laughter', 'Show', 'Jokes', 'Humor', 'Comedian'],
            'Party' => ['Party', 'Celebration', 'Music', 'Dance', 'Nightlife', 'Drinks', 'Social'],
            'Pop Culture' => ['Pop Culture', 'Comic', 'Cosplay', 'Gaming', 'Fandom', 'Geek', 'Anime'],
            'Movie / Drama' => ['Movie', 'Drama', 'Film', 'Cinema', 'Screening', 'Theater', 'Acting']
        ];
        $categoryName = $event->category->name;
        $tags = $categoryTags[$categoryName] ?? ($event->tags ?? []);

        // Map organizer avatars dynamically based on name
        $organizerAvatars = [
            'Eventra Team' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
            'Green Future Org' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
            'Tech Frontiers' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
            'Global Rhythms' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
        ];
        $organizerName = $event->organizer?->name ?? 'Unknown Organizer';
        $defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80';
        $avatar = $organizerAvatars[$organizerName] ?? $defaultAvatar;

        return [
            'id' => $event->id,
            'title' => $event->title,
            'slug' => $event->slug,
            'category' => $event->category->name,
            'dateBadge' => ['day' => $day, 'month' => $month],
            'dateText' => $date->format('l, F j, Y'),
            'date' => $event->event_date->format('Y-m-d'),
            'time' => date('h:i A', strtotime($event->event_time)),
            'venue' => $event->location,
            'image' => $event->image_path,
            'organizer' => [
                'name' => $event->organizer?->name ?? 'Eventra Team',
                'avatar' => $avatar,
                'organizationName' => $event->organizer?->organization_name,
                'organization_name' => $event->organizer?->organization_name,
                'contactInfo' => $event->organizer?->contact_info,
                'contact_info' => $event->organizer?->contact_info,
            ],
            'seatsLeft' => (int) $event->seats_left,
            'totalSeats' => (int) $event->total_seats,
            'ticketType' => $event->ticket_type,
            'ticket_type' => $event->ticket_type,
            'ticketPrice' => (float) $event->ticket_price,
            'ticket_price' => (float) $event->ticket_price,
            'eventEndDate' => $event->event_end_date ? $event->event_end_date->format('Y-m-d') : null,
            'eventEndTime' => $event->event_end_time ? date('h:i A', strtotime($event->event_end_time)) : null,
            'rating' => (float) $event->rating,
            'gallery' => $event->gallery ?? [],
            'speakers' => $event->speakers ?? [],
            'tags' => $tags,
            'rules' => $event->rules ?? [],
            'description' => $event->description,
            'status' => $status,
            'rawStatus' => $rawStatus,
        ];
    }

    /**
     * Get all content required to render the About Us page.
     */
    public function getAboutUsPage()
    {
        $hero = PageHero::where('page', 'about-us')->first();
        return response()->json([
            'hero' => $hero ? [
                'title' => $hero->title,
                'subtitle' => $hero->subtitle,
                'background_color' => $hero->background_color,
                'background_image' => $hero->background_image_path,
            ] : null,
            'team_members' => json_decode(Setting::getValue('about_us_team_members', '[]'), true),
            'choose_features' => json_decode(Setting::getValue('about_us_choose_features', '[]'), true),
            'timeline_steps' => json_decode(Setting::getValue('about_us_timeline_steps', '[]'), true),
            'partners' => json_decode(Setting::getValue('about_us_partners', '[]'), true),
            'testimonials' => json_decode(Setting::getValue('about_us_testimonials', '[]'), true),
            'faq_items' => json_decode(Setting::getValue('about_us_faq_items', '[]'), true),
            'stats' => json_decode(Setting::getValue('about_us_stats', '[]'), true),
        ]);
    }

    /**
     * Get all content required to render the Services page.
     */
    public function getServicesPage()
    {
        $hero = PageHero::where('page', 'services')->first();
        return response()->json([
            'hero' => $hero ? [
                'title' => $hero->title,
                'subtitle' => $hero->subtitle,
                'background_color' => $hero->background_color,
                'background_image' => $hero->background_image_path,
            ] : null,
            'core_services' => json_decode(Setting::getValue('services_core', '[]'), true),
            'additional_services' => json_decode(Setting::getValue('services_additional', '[]'), true),
            'timeline_steps' => json_decode(Setting::getValue('services_timeline_steps', '[]'), true),
            'why_choose_us' => json_decode(Setting::getValue('services_why_choose_us', '[]'), true),
            'portfolio_projects' => json_decode(Setting::getValue('services_portfolio_projects', '[]'), true),
            'pricing_packages' => json_decode(Setting::getValue('services_pricing_packages', '[]'), true),
            'testimonials' => json_decode(Setting::getValue('services_testimonials', '[]'), true),
            'faq_items' => json_decode(Setting::getValue('services_faq_items', '[]'), true),
        ]);
    }

    /**
     * Get all content required to render the Contact Us page.
     */
    public function getContactUsPage()
    {
        $hero = PageHero::where('page', 'contact-us')->first();
        return response()->json([
            'hero' => $hero ? [
                'title' => $hero->title,
                'subtitle' => $hero->subtitle,
                'background_color' => $hero->background_color,
                'background_image' => $hero->background_image_path,
            ] : null,
            'contact_info' => json_decode(Setting::getValue('contact_info', '[]'), true),
        ]);
    }

    /**
     * Get all content required to render the Certificate Verification page.
     */
    public function getCertificateVerificationPage()
    {
        $hero = PageHero::where('page', 'certificate-verification')->first();
        return response()->json([
            'hero' => $hero ? [
                'title' => $hero->title,
                'subtitle' => $hero->subtitle,
                'background_color' => $hero->background_color,
                'background_image' => $hero->background_image_path,
            ] : null,
            'faq_items' => json_decode(Setting::getValue('certificate_verification_faq_items', '[]'), true),
        ]);
    }

    /**
     * Get all categories list.
     */
    public function getCategories()
    {
        $categories = Category::all()->pluck('name')->toArray();
        return response()->json($categories);
    }

    /**
     * Verify a certificate.
     */
    public function verifyCertificate(Request $request)
    {
        $request->validate([
            'certificate_code' => 'required|string',
        ]);

        $certificate = Certificate::with(['event.category', 'event.organizer', 'user'])
            ->where('certificate_code', $request->certificate_code)
            ->first();

        if (!$certificate) {
            return response()->json(['message' => 'Certificate not found'], 404);
        }

        return response()->json([
            'id' => $certificate->certificate_code,
            'participantName' => $certificate->user->name,
            'eventName' => $certificate->event->title,
            'eventCategory' => $certificate->event->category->name,
            'organizer' => $certificate->event->organizer->organization_name ?? $certificate->event->organizer->name,
            'issueDate' => $certificate->issued_at ? $certificate->issued_at->format('F j, Y') : now()->format('F j, Y'),
            'status' => 'Verified',
        ]);
    }

    /**
     * Handle contact form submissions.
     */
    public function submitContactForm(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
            'subject' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
        ]);

        // Simply return success since there is no database storage specified for contacts
        return response()->json(['message' => 'Your message was sent successfully!']);
    }
}
