<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminAuditLog extends Model
{
    public $timestamps = false;

    protected $table = 'admin_audit_log';

    protected $fillable = [
        'admin_user_id',
        'action',
        'subject_type',
        'subject_id',
        'before',
        'after',
        'ip_address',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'before'     => 'array',
            'after'      => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'admin_user_id');
    }

    /** Record an admin action. Call this from admin controllers. */
    public static function record(
        int    $adminId,
        string $action,
        string $subjectType,
        mixed  $subjectId,
        array  $before = [],
        array  $after  = [],
        string $ip     = '',
    ): void {
        static::create([
            'admin_user_id' => $adminId,
            'action'        => $action,
            'subject_type'  => $subjectType,
            'subject_id'    => $subjectId,
            'before'        => $before ?: null,
            'after'         => $after  ?: null,
            'ip_address'    => $ip,
            'created_at'    => now(),
        ]);
    }
}
