<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'email', 'subject', 'phone', 'message'])]
class ContactMessage extends Model
{
    // Attributes fillable is handled by class attribute in Laravel 11/12
}
