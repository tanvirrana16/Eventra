<?php

namespace App\Http\Controllers\Admin;

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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Handle autologin from frontend.
     */
    public function autologin(Request $request)
    {
        $email = $request->query('email');
        $token = $request->query('token');

        $user = User::where('email', $email)->where('remember_token', $token)->first();

        if ($user && $user->role === 'admin') {
            // Clear temporary autologin token
            $user->remember_token = null;
            $user->save();
            
            Auth::login($user);
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }

        return redirect('http://localhost:5173/login');
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('http://localhost:5173/login');
    }

    /**
     * Dashboard home/statistics overview page.
     */
    public function dashboard()
    {
        $stats = [
            'total_events' => Event::count(),
            'published_events' => Event::published()->count(),
            'draft_events' => Event::where('status', 'draft')->count(),
            'archived_events' => Event::where('status', 'archived')->count(),
            'total_participants' => User::where('role', 'participant')->count(),
            'total_organizers' => User::where('role', 'organizer')->count(),
            'pending_organizers' => User::where('role', 'organizer')->where('status', 'pending')->count(),
            'total_registrations' => EventRegistration::count(),
            'total_certificates' => Certificate::count(),
        ];

        // Fetch recent signups & events for summary tables
        $recentOrganizers = User::where('role', 'organizer')->orderBy('created_at', 'desc')->take(5)->get();
        $recentEvents = Event::with('category')->orderBy('created_at', 'desc')->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recentOrganizers', 'recentEvents'));
    }

    /**
     * Homepage Hero Left & Right Slider Management.
     */
    public function heroSettings()
    {
        $hero = [
            'title' => Setting::getValue('hero_title', ''),
            'subtitle' => Setting::getValue('hero_subtitle', ''),
            'btn1_text' => Setting::getValue('hero_btn1_text', ''),
            'btn1_url' => Setting::getValue('hero_btn1_url', ''),
            'btn2_text' => Setting::getValue('hero_btn2_text', ''),
            'btn2_url' => Setting::getValue('hero_btn2_url', ''),
        ];

        $slides = HeroSlide::orderBy('display_order', 'asc')->get();

        return view('admin.hero', compact('hero', 'slides'));
    }

    /**
     * Update Left Side Hero details.
     */
    public function updateHeroSettings(Request $request)
    {
        $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'required|string',
            'hero_btn1_text' => 'nullable|string|max:50',
            'hero_btn1_url' => 'nullable|string|max:255',
            'hero_btn2_text' => 'nullable|string|max:50',
            'hero_btn2_url' => 'nullable|string|max:255',
        ]);

        Setting::setValue('hero_title', $request->hero_title);
        Setting::setValue('hero_subtitle', $request->hero_subtitle);
        Setting::setValue('hero_btn1_text', $request->hero_btn1_text);
        Setting::setValue('hero_btn1_url', $request->hero_btn1_url);
        Setting::setValue('hero_btn2_text', $request->hero_btn2_text);
        Setting::setValue('hero_btn2_url', $request->hero_btn2_url);

        return back()->with('success', 'Hero text settings updated successfully.');
    }

    /**
     * Create / Edit Slider Slide form.
     */
    public function storeHeroSlide(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'title' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'display_order' => 'integer',
        ]);

        $imagePath = '';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/hero', 'public');
            $imagePath = Storage::url($path);
        }

        HeroSlide::create([
            'image_path' => $imagePath,
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'display_order' => $request->display_order ?? 0,
            'is_active' => $request->has('is_active'),
        ]);

        return back()->with('success', 'Hero slide item added successfully.');
    }

    public function updateHeroSlide(Request $request, HeroSlide $slide)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'title' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'display_order' => 'integer',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'link' => $request->link,
            'display_order' => $request->display_order ?? 0,
            'is_active' => $request->has('is_active'),
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/hero', 'public');
            $data['image_path'] = Storage::url($path);
        }

        $slide->update($data);

        return back()->with('success', 'Hero slide item updated successfully.');
    }

    public function destroyHeroSlide(HeroSlide $slide)
    {
        $slide->delete();
        return back()->with('success', 'Hero slide item deleted successfully.');
    }

    /**
     * Other Page Heroes (Banners) Management.
     */
    public function pageHeroes()
    {
        $heroes = PageHero::all();
        return view('admin.pages', compact('heroes'));
    }

    public function updatePageHero(Request $request, PageHero $hero)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'background_color' => 'required|string|max:20',
            'background_image' => 'nullable|image|max:5120',
            'cta_text' => 'nullable|string|max:100',
            'cta_link' => 'nullable|string|max:255',
        ]);

        $data = [
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'background_color' => $request->background_color,
            'cta_text' => $request->cta_text,
            'cta_link' => $request->cta_link,
        ];

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('uploads/banners', 'public');
            $data['background_image_path'] = Storage::url($path);
        }

        $hero->update($data);

        return back()->with('success', 'Page hero banner updated successfully.');
    }

    /**
     * Categories CRUD.
     */
    public function categories()
    {
        $categories = Category::withCount(['events'])->get();
        return view('admin.categories', compact('categories'));
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'icon_name' => 'required|string|max:50',
        ]);

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon_name' => $request->icon_name,
        ]);

        return back()->with('success', 'Category created successfully.');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'icon_name' => 'required|string|max:50',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon_name' => $request->icon_name,
        ]);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Category deleted successfully.');
    }

    /**
     * Events CRUD & status toggle.
     */
    public function events()
    {
        $events = Event::with(['category', 'organizer'])->orderBy('created_at', 'desc')->get();
        $categories = Category::all();
        return view('admin.events', compact('events', 'categories'));
    }

    public function storeEvent(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'event_date' => 'required|date',
            'event_time' => 'required',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'status' => 'required|in:draft,published,archived',
            'total_seats' => 'nullable|integer|min:1',
            'ticket_type' => 'nullable|in:free,paid',
            'ticket_price' => 'nullable|numeric|min:0',
        ]);

        $imagePath = '';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/events', 'public');
            $imagePath = Storage::url($path);
        } else {
            // Default placeholder image
            $imagePath = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
        }

        $totalSeats = (int) ($request->total_seats ?? 100);
        Event::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . rand(100, 999),
            'category_id' => $request->category_id,
            'event_date' => $request->event_date,
            'event_time' => $request->event_time,
            'location' => $request->location,
            'description' => $request->description,
            'image_path' => $imagePath,
            'status' => $request->status,
            'total_seats' => $totalSeats,
            'seats_left' => $totalSeats,
            'ticket_type' => $request->ticket_type ?? 'free',
            'ticket_price' => $request->ticket_price ?? 0.00,
            'created_by' => Auth::id(),
        ]);

        return back()->with('success', 'Event created successfully.');
    }

    public function updateEvent(Request $request, Event $event)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'event_date' => 'required|date',
            'event_time' => 'required',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'status' => 'required|in:draft,published,archived',
        ]);

        $data = [
            'title' => $request->title,
            'category_id' => $request->category_id,
            'event_date' => $request->event_date,
            'event_time' => $request->event_time,
            'location' => $request->location,
            'description' => $request->description,
            'status' => $request->status,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/events', 'public');
            $data['image_path'] = Storage::url($path);
        }

        $event->update($data);

        return back()->with('success', 'Event details updated successfully.');
    }

    public function toggleEventStatus(Request $request, Event $event)
    {
        $request->validate([
            'status' => 'required|in:draft,published,archived',
        ]);

        $event->update(['status' => $request->status]);

        return back()->with('success', "Event status changed to: " . ucfirst($request->status));
    }

    public function destroyEvent(Event $event)
    {
        $event->delete();
        return back()->with('success', 'Event deleted successfully.');
    }

    /**
     * Footer configuration & menus CRUD.
     */
    public function footerSettings()
    {
        $footer = [
            'brand_title' => Setting::getValue('footer_brand_title', 'EVENTRA'),
            'brand_desc' => Setting::getValue('footer_brand_desc', ''),
            'brand_copyright' => Setting::getValue('footer_brand_copyright', ''),
            'contact_global_heading' => Setting::getValue('footer_contact_global_heading', ''),
            'contact_global_phone' => Setting::getValue('footer_contact_global_phone', ''),
            'contact_global_email' => Setting::getValue('footer_contact_global_email', ''),
            'contact_bd_heading' => Setting::getValue('footer_contact_bd_heading', ''),
            'contact_bd_phone' => Setting::getValue('footer_contact_bd_phone', ''),
            'contact_bd_email' => Setting::getValue('footer_contact_bd_email', ''),
        ];

        $links = FooterLink::orderBy('type')->orderBy('display_order')->get();

        return view('admin.footer', compact('footer', 'links'));
    }

    public function updateFooterSettings(Request $request)
    {
        $request->validate([
            'brand_title' => 'required|string|max:100',
            'brand_desc' => 'required|string',
            'brand_copyright' => 'required|string|max:255',
            'contact_global_heading' => 'required|string|max:100',
            'contact_global_phone' => 'required|string|max:50',
            'contact_global_email' => 'required|email|max:100',
            'contact_bd_heading' => 'required|string|max:100',
            'contact_bd_phone' => 'required|string|max:50',
            'contact_bd_email' => 'required|email|max:100',
            'logo' => 'nullable|image|max:2048',
        ]);

        Setting::setValue('footer_brand_title', $request->brand_title);
        Setting::setValue('footer_brand_desc', $request->brand_desc);
        Setting::setValue('footer_brand_copyright', $request->brand_copyright);
        Setting::setValue('footer_contact_global_heading', $request->contact_global_heading);
        Setting::setValue('footer_contact_global_phone', $request->contact_global_phone);
        Setting::setValue('footer_contact_global_email', $request->contact_global_email);
        Setting::setValue('footer_contact_bd_heading', $request->contact_bd_heading);
        Setting::setValue('footer_contact_bd_phone', $request->contact_bd_phone);
        Setting::setValue('footer_contact_bd_email', $request->contact_bd_email);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('uploads/brand', 'public');
            Setting::setValue('footer_brand_logo', Storage::url($path));
        }

        return back()->with('success', 'Footer layout settings updated successfully.');
    }

    public function storeFooterLink(Request $request)
    {
        $request->validate([
            'type' => 'required|in:support,eventra',
            'name' => 'required|string|max:100',
            'url' => 'required|string|max:255',
            'display_order' => 'integer',
        ]);

        FooterLink::create([
            'type' => $request->type,
            'name' => $request->name,
            'url' => $request->url,
            'display_order' => $request->display_order ?? 0,
            'is_active' => $request->has('is_active'),
        ]);

        return back()->with('success', 'Footer link added successfully.');
    }

    public function updateFooterLink(Request $request, FooterLink $link)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'url' => 'required|string|max:255',
            'display_order' => 'integer',
        ]);

        $link->update([
            'name' => $request->name,
            'url' => $request->url,
            'display_order' => $request->display_order ?? 0,
            'is_active' => $request->has('is_active'),
        ]);

        return back()->with('success', 'Footer link details updated successfully.');
    }

    public function destroyFooterLink(FooterLink $link)
    {
        $link->delete();
        return back()->with('success', 'Footer link deleted successfully.');
    }

    /**
     * Organizers registration approvals.
     */
    public function organizers()
    {
        $pending = User::where('role', 'organizer')->where('status', 'pending')->orderBy('created_at', 'desc')->get();
        $approved = User::where('role', 'organizer')->where('status', 'approved')->orderBy('created_at', 'desc')->get();
        $rejected = User::where('role', 'organizer')->where('status', 'rejected')->orderBy('created_at', 'desc')->get();

        return view('admin.organizers', compact('pending', 'approved', 'rejected'));
    }

    public function approveOrganizer(User $user)
    {
        if ($user->role !== 'organizer') {
            return back()->with('error', 'This user is not an organizer.');
        }

        $user->update(['status' => 'approved']);

        return back()->with('success', "Approved organizer: {$user->name}. They can now host events.");
    }

    public function rejectOrganizer(User $user)
    {
        if ($user->role !== 'organizer') {
            return back()->with('error', 'This user is not an organizer.');
        }

        $user->update(['status' => 'rejected']);

        return back()->with('success', "Rejected organizer application: {$user->name}.");
    }
}
