<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'meta_title',
        'meta_description',
        'is_published',
        'show_in_header',
        'show_in_footer',
        'menu_order',
    ];

    protected function casts(): array
    {
        return [
            'is_published'  => 'boolean',
            'show_in_header' => 'boolean',
            'show_in_footer' => 'boolean',
            'menu_order'    => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeInHeader(Builder $query): Builder
    {
        return $query->published()->where('show_in_header', true)->orderBy('menu_order');
    }

    public function scopeInFooter(Builder $query): Builder
    {
        return $query->published()->where('show_in_footer', true)->orderBy('menu_order');
    }
}
