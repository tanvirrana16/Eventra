<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    public $timestamps = false;

    protected $fillable = ['event_id', 'user_id', 'certificate_code', 'issued_at'];

    protected $casts = [
        'issued_at' => 'datetime',
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
