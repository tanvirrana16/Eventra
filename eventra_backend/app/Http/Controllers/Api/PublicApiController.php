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

        return [
            'id' => $event->id,
            'title' => $event->title,
            'slug' => $event->slug,
            'category' => $event->category->name,
            'dateBadge' => ['day' => $day, 'month' => $month],
            'dateText' => $date->format('l, F j, Y'),
            'time' => date('h:i A', strtotime($event->event_time)),
            'venue' => $event->location,
            'image' => $event->image_path,
            'organizer' => [
                'name' => $event->organizer->name,
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80', // Default mock avatar
                'organization_name' => $event->organizer->organization_name,
            ],
            'description' => $event->description,
            'status' => 'Upcoming', // Placeholder status for Phase 1
        ];
    }
}
