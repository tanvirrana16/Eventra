<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['type', 'name', 'url', 'display_order', 'is_active'])]
class FooterLink extends Model
{
    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * display order developed later
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('display_order', 'asc');
    }
}
