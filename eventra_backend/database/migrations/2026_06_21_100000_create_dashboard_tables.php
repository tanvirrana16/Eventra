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
        // 1. Add profile and settings columns to users table
        Schema::table('users', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->after('contact_info');
            $table->string('gender')->nullable()->after('date_of_birth');
            $table->string('occupation')->nullable()->after('gender');
            $table->text('address')->nullable()->after('occupation');
            $table->string('profile_photo')->nullable()->after('address');
            $table->boolean('two_factor_enabled')->default(false)->after('profile_photo');
            $table->boolean('email_notifications')->default(true)->after('two_factor_enabled');
            $table->boolean('sms_notifications')->default(false)->after('email_notifications');
            $table->boolean('event_recommendations')->default(true)->after('sms_notifications');
        });

        // 2. Create notifications table
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // 3. Create user_activities table
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('action');
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
        Schema::dropIfExists('notifications');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth',
                'gender',
                'occupation',
                'address',
                'profile_photo',
                'two_factor_enabled',
                'email_notifications',
                'sms_notifications',
                'event_recommendations',
            ]);
        });
    }
};
