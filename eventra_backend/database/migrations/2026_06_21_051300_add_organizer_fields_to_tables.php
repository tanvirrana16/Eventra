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
        // 1. Add fields to events table
        Schema::table('events', function (Blueprint $table) {
            $table->string('currency')->default('USD')->nullable()->after('ticket_price');
            $table->json('payment_methods')->nullable()->after('currency');
            $table->json('certificate_template')->nullable()->after('rules');
        });

        // 2. Add fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('website')->nullable()->after('contact_info');
            $table->json('social_links')->nullable()->after('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['website', 'social_links']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['currency', 'payment_methods', 'certificate_template']);
        });
    }
};

