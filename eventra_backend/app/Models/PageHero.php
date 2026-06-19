<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['page', 'title', 'subtitle', 'background_image_path', 'background_color', 'cta_text', 'cta_link'])]
class PageHero extends Model
{
    // Reusable hero model
}
