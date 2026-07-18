<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $primaryKey = 'key';
    public    $incrementing = false;
    protected $keyType      = 'string';

    protected $fillable = ['key', 'value', 'type', 'group', 'description'];

    protected function casts(): array
    {
        return ['updated_at' => 'datetime'];
    }

    /** Retrieve a setting value by key with an optional fallback. */
    public static function get(string $key, mixed $default = null): mixed
    {
        return static::find($key)?->value ?? $default;
    }

    /** Upsert a single key-value pair. */
    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /** Bulk-upsert an associative array of key → value. */
    public static function setMany(array $pairs): void
    {
        foreach ($pairs as $key => $value) {
            static::set($key, $value);
        }
    }

    /** Return all settings as a flat key → value map. */
    public static function allAsMap(): array
    {
        return static::all()->pluck('value', 'key')->toArray();
    }
}
