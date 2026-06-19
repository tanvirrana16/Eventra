<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'slug', 'icon_name'])]
class Category extends Model
{
    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
