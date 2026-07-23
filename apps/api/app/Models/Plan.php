<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'price_inr',
        'interval',
        'stripe_price_id',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price'      => 'decimal:2',
        'price_inr'  => 'decimal:2',
        'features'   => 'array',
        'is_active'  => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
