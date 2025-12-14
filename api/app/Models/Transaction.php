<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    public const TYPE_DEPOSIT = 'deposit';
    public const TYPE_TRANSFER = 'transfer';
    public const TYPE_REVERSAL = 'reversal';

    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REVERSED = 'reversed';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'type',
        'status',
        'amount',
        'from_user_id',
        'to_user_id',
        'reference_id',
        'meta',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'meta' => 'array',
    ];

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function reference(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'reference_id');
    }
}
