<?php

namespace App\Services\Wallet;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DepositService
{
    public function handle(User $user, string|float|int $amount): Transaction
    {
        $value = (float) $amount;

        if ($value <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['O valor do depósito deve ser maior que zero.'],
            ]);
        }

        return DB::transaction(function () use ($user, $value) {
            $wallet = Wallet::query()
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (! $wallet) {
                $wallet = Wallet::create([
                    'user_id' => $user->id,
                    'balance' => 0,
                ]);

                $wallet = Wallet::query()
                    ->where('user_id', $user->id)
                    ->lockForUpdate()
                    ->firstOrFail();
            }

            $wallet->balance = (float)$wallet->balance + $value;
            $wallet->save();

            return Transaction::create([
                'type' => Transaction::TYPE_DEPOSIT,
                'status' => Transaction::STATUS_COMPLETED,
                'amount' => $value,
                'from_user_id' => null,
                'to_user_id' => $user->id,
                'reference_id' => null,
                'meta' => null,
            ]);
        });
    }
}
