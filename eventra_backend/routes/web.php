<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

// Redirect home to the React frontend
Route::get('/', function () {
    return redirect('http://localhost:5173');
});

// Admin Authentication Routes
Route::get('/admin/autologin', [AdminController::class, 'autologin'])->name('admin.autologin');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

// Protected Admin Dashboard Routes
Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // Hero Settings & Slides
    Route::get('/hero', [AdminController::class, 'heroSettings'])->name('hero');
    Route::post('/hero', [AdminController::class, 'updateHeroSettings'])->name('hero.update');
    Route::post('/hero/slides', [AdminController::class, 'storeHeroSlide'])->name('hero.slide.store');
    Route::put('/hero/slides/{slide}', [AdminController::class, 'updateHeroSlide'])->name('hero.slide.update');
    Route::delete('/hero/slides/{slide}', [AdminController::class, 'destroyHeroSlide'])->name('hero.slide.destroy');

    // Page Heroes
    Route::get('/pages', [AdminController::class, 'pageHeroes'])->name('pages');
    Route::put('/pages/{hero}', [AdminController::class, 'updatePageHero'])->name('pages.update');

    // Category CRUD
    Route::get('/categories', [AdminController::class, 'categories'])->name('categories');
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('categories.store');
    Route::put('/categories/{category}', [AdminController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminController::class, 'destroyCategory'])->name('categories.destroy');

    // Events Management
    Route::get('/events', [AdminController::class, 'events'])->name('events');
    Route::post('/events', [AdminController::class, 'storeEvent'])->name('events.store');
    Route::put('/events/{event}', [AdminController::class, 'updateEvent'])->name('events.update');
    Route::patch('/events/{event}/toggle', [AdminController::class, 'toggleEventStatus'])->name('events.toggle');
    Route::delete('/events/{event}', [AdminController::class, 'destroyEvent'])->name('events.destroy');

    // Organizers approvals
    Route::get('/organizers', [AdminController::class, 'organizers'])->name('organizers');
    Route::post('/organizers/{user}/approve', [AdminController::class, 'approveOrganizer'])->name('organizers.approve');
    Route::post('/organizers/{user}/reject', [AdminController::class, 'rejectOrganizer'])->name('organizers.reject');

    // Registrations & Transactions logs
    Route::get('/registrations', [AdminController::class, 'registrations'])->name('registrations');

    // Settings, active payment methods & system notification builder
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::post('/settings/rules', [AdminController::class, 'saveRules'])->name('settings.rules');
    Route::post('/settings/notify', [AdminController::class, 'broadcastNotification'])->name('settings.notify');

    // Footer settings
    Route::get('/footer', [AdminController::class, 'footerSettings'])->name('footer');
    Route::post('/footer', [AdminController::class, 'updateFooterSettings'])->name('footer.update');
    Route::post('/footer/links', [AdminController::class, 'storeFooterLink'])->name('footer.links.store');
    Route::put('/footer/links/{link}', [AdminController::class, 'updateFooterLink'])->name('footer.links.update');
    Route::delete('/footer/links/{link}', [AdminController::class, 'destroyFooterLink'])->name('footer.links.destroy');

    // Services settings
    Route::get('/services', [AdminController::class, 'servicesSettings'])->name('services');
    Route::post('/services/{section}', [AdminController::class, 'addPageItem'])->name('services.add');
    Route::put('/services/{section}/{index}', [AdminController::class, 'updatePageItem'])->name('services.update');
    Route::delete('/services/{section}/{index}', [AdminController::class, 'deletePageItem'])->name('services.delete');

    // Certificate Verification settings
    Route::get('/verification', [AdminController::class, 'verificationSettings'])->name('verification');
    Route::post('/verification/{section}', [AdminController::class, 'addPageItem'])->name('verification.add');
    Route::put('/verification/{section}/{index}', [AdminController::class, 'updatePageItem'])->name('verification.update');
    Route::delete('/verification/{section}/{index}', [AdminController::class, 'deletePageItem'])->name('verification.delete');

    // About Us settings
    Route::get('/about', [AdminController::class, 'aboutSettings'])->name('about');
    Route::post('/about/{section}', [AdminController::class, 'addPageItem'])->name('about.add');
    Route::put('/about/{section}/{index}', [AdminController::class, 'updatePageItem'])->name('about.update');
    Route::delete('/about/{section}/{index}', [AdminController::class, 'deletePageItem'])->name('about.delete');

    // Contact settings
    Route::get('/contact', [AdminController::class, 'contactSettings'])->name('contact');
    Route::post('/contact/{section}', [AdminController::class, 'addPageItem'])->name('contact.add');
    Route::put('/contact/{section}/{index}', [AdminController::class, 'updatePageItem'])->name('contact.update');
    Route::delete('/contact/messages/{id}', [AdminController::class, 'deleteContactMessage'])->name('contact.messages.delete');
    Route::delete('/contact/{section}/{index}', [AdminController::class, 'deletePageItem'])->name('contact.delete');
});
