<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'source',
        'status',
        'ip_address',
        'user_agent',
    ];

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }
}
