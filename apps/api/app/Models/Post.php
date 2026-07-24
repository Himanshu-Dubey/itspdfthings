<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image',
        'category_id',
        'reading_time',
        'allow_comments',
        'is_published',
        'published_at',
        'author_id',
        'author_name',
    ];

    protected function casts(): array
    {
        return [
            'allow_comments' => 'boolean',
            'is_published'   => 'boolean',
            'reading_time'   => 'integer',
            'published_at'   => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tags');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function approvedComments(): HasMany
    {
        return $this->hasMany(Comment::class)->where('is_approved', true)->latest();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->where('published_at', '<=', now());
    }

    public function scopeLatestPublished(Builder $query): Builder
    {
        return $query->published()->orderBy('published_at', 'desc');
    }

    public function calculateReadingTime(): int
    {
        $text = strip_tags($this->content ?? '');
        $words = str_word_count($text);
        return max(1, (int) ceil($words / 200));
    }
}
