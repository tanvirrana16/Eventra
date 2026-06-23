<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'event_id',
        'user_id',
        'registration_code',
        'payment_method',
        'payment_amount',
        'payment_status',
        'security_token',
        'pass_status',
        'registered_at',
        'transaction_id',
        'payment_date'
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'payment_date' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
