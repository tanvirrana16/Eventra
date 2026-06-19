<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title', 'slug', 'description', 'event_date', 'event_time', 'location', 'image_path', 'seats_left', 'rating', 'gallery', 'speakers', 'tags', 'status', 'category_id', 'created_by'])]
class Event extends Model
{
    protected $casts = [
        'event_date' => 'date',
        'seats_left' => 'integer',
        'rating' => 'decimal:2',
        'gallery' => 'array',
        'speakers' => 'array',
        'tags' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Scope for published events.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for latest events.
     */
    public function scopeLatestEvents($query, $limit = 4)
    {
        return $query->published()
            ->orderBy('event_date', 'desc')
            ->orderBy('event_time', 'desc')
            ->limit($limit);
    }

    /**
     * Scope for upcoming events.
     */
    public function scopeUpcomingEvents($query, $limit = 4)
    {
        return $query->published()
            ->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date', 'asc')
            ->orderBy('event_time', 'asc')
            ->limit($limit);
    }
}
