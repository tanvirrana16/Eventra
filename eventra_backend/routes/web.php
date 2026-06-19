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

    // Footer settings
    Route::get('/footer', [AdminController::class, 'footerSettings'])->name('footer');
    Route::post('/footer', [AdminController::class, 'updateFooterSettings'])->name('footer.update');
    Route::post('/footer/links', [AdminController::class, 'storeFooterLink'])->name('footer.links.store');
    Route::put('/footer/links/{link}', [AdminController::class, 'updateFooterLink'])->name('footer.links.update');
    Route::delete('/footer/links/{link}', [AdminController::class, 'destroyFooterLink'])->name('footer.links.destroy');
});
