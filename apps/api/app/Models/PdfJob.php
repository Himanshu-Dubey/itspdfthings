<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PdfJob extends Model
{
    use HasUuids;

    protected $table = 'jobs';

    protected $fillable = [
        'user_id',
        'tool_type',
        'status',
        'input_path',
        'output_path',
        'error_message',
        'options',
        'processing_time_ms',
        'delete_after',
    ];

    protected function casts(): array
    {
        return [
            'options'      => 'array',
            'delete_after' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPending(): bool   { return $this->status === 'pending'; }
    public function isCompleted(): bool { return $this->status === 'completed'; }
    public function isFailed(): bool    { return $this->status === 'failed'; }
}
