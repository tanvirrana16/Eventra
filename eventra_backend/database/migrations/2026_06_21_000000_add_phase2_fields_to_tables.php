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
        // 1. Add api_token to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token')->nullable()->unique()->after('password');
        });

        // 2. Add total_seats, event_end_date, event_end_time, ticket_type, ticket_price, and rules to events table
        Schema::table('events', function (Blueprint $table) {
            $table->integer('total_seats')->default(100)->after('seats_left');
            $table->date('event_end_date')->nullable()->after('event_date');
            $table->time('event_end_time')->nullable()->after('event_time');
            $table->enum('ticket_type', ['free', 'paid'])->default('free')->after('seats_left');
            $table->decimal('ticket_price', 8, 2)->default(0.00)->after('ticket_type');
            $table->json('rules')->nullable()->after('tags');
        });

        // 3. Add registration_code, payment_method, payment_amount, payment_status, security_token, and pass_status to event_registrations table
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->string('registration_code')->nullable()->unique()->after('user_id');
            $table->string('payment_method')->nullable()->after('registration_code');
            $table->decimal('payment_amount', 8, 2)->default(0.00)->after('payment_method');
            $table->string('payment_status')->default('free')->after('payment_amount'); // 'free', 'pending', 'paid'
            $table->string('security_token')->nullable()->after('payment_status');
            $table->string('pass_status')->default('Active')->after('security_token'); // 'Active', 'Checked-in', 'Cancelled'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'registration_code',
                'payment_method',
                'payment_amount',
                'payment_status',
                'security_token',
                'pass_status'
            ]);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'total_seats',
                'event_end_date',
                'event_end_time',
                'ticket_type',
                'ticket_price',
                'rules'
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('api_token');
        });
    }
};
