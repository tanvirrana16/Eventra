<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicApiController;
use Illuminate\Support\Facades\Route;

// Public Feed and Pages API
Route::get('/homepage', [PublicApiController::class, 'getHomepage']);
Route::get('/events', [PublicApiController::class, 'getEvents']);
Route::get('/pages/hero/{page}', [PublicApiController::class, 'getPageHero']);

// Authentication APIs
Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/login', [AuthController::class, 'login']);
