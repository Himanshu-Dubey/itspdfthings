<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Setting extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['key', 'value', 'type', 'group', 'description'];
    protected $casts = [];

    public function getValueAttribute(mixed $raw): mixed
    {
        return match ($this->attributes->get('type', 'string')) {
            'boolean' => (bool) $raw,
            'integer' => (int) $raw,
            'json'    => json_decode($raw, true),
            default   => $raw,
        };
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = DB::table('settings')->where('key', $key)->first();
        if (! $row) return $default;

        return match ($row->type) {
            'boolean' => (bool) $row->value,
            'integer' => (int) $row->value,
            'json'    => json_decode($row->value, true),
            default   => $row->value,
        };
    }

    public static function set(string $key, mixed $value): static
    {
        return static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public static function allAsMap(): array
    {
        $settings = DB::table('settings')->get();
        $map = [];
        foreach ($settings as $s) {
            $map[$s->key] = match ($s->type) {
                'boolean' => (bool) $s->value,
                'integer' => (int) $s->value,
                'json'    => json_decode($s->value, true),
                default   => $s->value,
            };
        }
        return $map;
    }

    public static function setMany(array $data): void
    {
        foreach ($data as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }
    }
}
