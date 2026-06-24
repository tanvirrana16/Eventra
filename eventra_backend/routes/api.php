<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicApiController;
use App\Http\Controllers\Api\EventRegistrationController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\OrganizerDashboardController;
use App\Http\Controllers\Api\SSLCommerzController;
use Illuminate\Support\Facades\Route;

// Public Feed and Pages API
Route::get('/homepage', [PublicApiController::class, 'getHomepage']);
Route::get('/events', [PublicApiController::class, 'getEvents']);
Route::get('/pages/hero/{page}', [PublicApiController::class, 'getPageHero']);

// New dynamic page configuration endpoints
Route::get('/about-us', [PublicApiController::class, 'getAboutUsPage']);
Route::get('/services', [PublicApiController::class, 'getServicesPage']);
Route::get('/contact-us', [PublicApiController::class, 'getContactUsPage']);
Route::get('/certificate-verification', [PublicApiController::class, 'getCertificateVerificationPage']);
Route::get('/categories', [PublicApiController::class, 'getCategories']);

// Certificate Verification & Contact Submission
Route::post('/certificates/verify', [PublicApiController::class, 'verifyCertificate']);
Route::post('/contact', [PublicApiController::class, 'submitContactForm']);
Route::get('/pass/verify', [PublicApiController::class, 'verifyPass']);

// SSLCommerz Public Callbacks & Details
Route::get('/sslcommerz/details', [SSLCommerzController::class, 'details']);
Route::post('/sslcommerz/success', [SSLCommerzController::class, 'success']);
Route::post('/sslcommerz/cancel', [SSLCommerzController::class, 'cancel']);

// Authentication APIs
Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Registration API
Route::post('/events/{event}/register', [EventRegistrationController::class, 'register']);

// Authenticated Participant Dashboard Routes
Route::middleware('api.token')->group(function () {
    Route::post('/sslcommerz/initiate', [SSLCommerzController::class, 'initiate']);
    Route::get('/user/dashboard', [UserDashboardController::class, 'dashboard']);
    Route::get('/user/profile', [UserDashboardController::class, 'profile']);
    Route::put('/user/profile', [UserDashboardController::class, 'updateProfile']);
    Route::get('/user/registrations', [UserDashboardController::class, 'registrations']);
    Route::get('/user/passes', [UserDashboardController::class, 'passes']);
    Route::get('/user/payments', [UserDashboardController::class, 'payments']);
    Route::get('/user/certificates', [UserDashboardController::class, 'certificates']);
    Route::get('/user/notifications', [UserDashboardController::class, 'notifications']);
    Route::put('/user/notifications/read-all', [UserDashboardController::class, 'markAllRead']);
    Route::put('/user/notifications/{id}/read', [UserDashboardController::class, 'markRead']);
    Route::delete('/user/notifications/{id}', [UserDashboardController::class, 'deleteNotification']);
    Route::put('/user/registrations/{id}/cancel', [UserDashboardController::class, 'cancelRegistration']);
    Route::put('/user/password', [UserDashboardController::class, 'changePassword']);
    Route::put('/user/settings', [UserDashboardController::class, 'updateSettings']);
    Route::delete('/user/account', [UserDashboardController::class, 'deleteAccount']);
});

// Authenticated Organizer Dashboard Routes
Route::middleware(['api.token', 'organizer'])->group(function () {
    Route::get('/organizer/dashboard', [OrganizerDashboardController::class, 'dashboard']);
    Route::get('/organizer/events', [OrganizerDashboardController::class, 'events']);
    Route::post('/organizer/events', [OrganizerDashboardController::class, 'createEvent']);
    Route::put('/organizer/events/{id}', [OrganizerDashboardController::class, 'updateEvent']);
    Route::delete('/organizer/events/{id}', [OrganizerDashboardController::class, 'deleteEvent']);
    Route::get('/organizer/participants', [OrganizerDashboardController::class, 'participants']);
    Route::put('/organizer/registrations/{id}/check-in', [OrganizerDashboardController::class, 'checkIn']);
    Route::get('/organizer/analytics', [OrganizerDashboardController::class, 'analytics']);
    Route::get('/organizer/notifications', [OrganizerDashboardController::class, 'notifications']);
    Route::put('/organizer/notifications/read-all', [OrganizerDashboardController::class, 'markAllRead']);
    Route::put('/organizer/notifications/{id}/read', [OrganizerDashboardController::class, 'markRead']);
    Route::delete('/organizer/notifications/{id}', [OrganizerDashboardController::class, 'deleteNotification']);
    Route::get('/organizer/profile', [OrganizerDashboardController::class, 'profile']);
    Route::put('/organizer/profile', [OrganizerDashboardController::class, 'updateProfile']);
    Route::put('/organizer/password', [OrganizerDashboardController::class, 'changePassword']);
    Route::put('/organizer/settings', [OrganizerDashboardController::class, 'updateSettings']);
    Route::post('/organizer/certificates/generate', [OrganizerDashboardController::class, 'generateCertificates']);
    Route::get('/organizer/certificates', [OrganizerDashboardController::class, 'certificates']);
    Route::post('/organizer/certificates/settings', [OrganizerDashboardController::class, 'saveCertificateSettings']);
    Route::get('/organizer/certificates/settings/{eventId}', [OrganizerDashboardController::class, 'getCertificateSettings']);
    Route::post('/organizer/certificates/send', [OrganizerDashboardController::class, 'sendCertificates']);
});

