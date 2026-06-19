<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Settings Table (key-value configurations)
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->string('type')->default('text');
            $table->timestamps();
        });

        // 2. Hero Slides Table (slider items)
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('image_path');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('link')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Page Heroes Table (reusable page banners)
        Schema::create('page_heroes', function (Blueprint $table) {
            $table->id();
            $table->string('page')->unique(); // 'events', 'services', 'certificate-verification', 'about-us', 'contact'
            $table->string('title');
            $table->text('subtitle');
            $table->string('background_image_path')->nullable();
            $table->string('background_color')->default('#0C3B2E');
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
            $table->timestamps();
        });

        // 4. Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon_name')->nullable();
            $table->timestamps();
        });

        // 5. Events Table
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->date('event_date');
            $table->time('event_time');
            $table->string('location');
            $table->string('image_path')->nullable();
            $table->integer('seats_left')->default(25);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->json('gallery')->nullable();
            $table->json('speakers')->nullable();
            $table->json('tags')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 6. Event Registrations Table (Participant signups)
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('registered_at')->useCurrent();
        });

        // 7. Certificates Table
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('certificate_code')->unique();
            $table->timestamp('issued_at')->useCurrent();
        });

        // 8. Footer Links Table (Support and Eventra menus)
        Schema::create('footer_links', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['support', 'eventra']);
            $table->string('name');
            $table->string('url');
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_links');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('events');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('page_heroes');
        Schema::dropIfExists('hero_slides');
        Schema::dropIfExists('settings');
    }
};
