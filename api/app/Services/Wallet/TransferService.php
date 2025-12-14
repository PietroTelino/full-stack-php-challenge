<?php

namespace App\Services\Wallet;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransferService
{
    public function handle(User $from, User $to, string|float|int $amount): Transaction
    {
        $value = (float) $amount;

        if ($value <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['O valor da transferência deve ser maior que zero.'],
            ]);
        }

        if ($from->id === $to->id) {
            throw ValidationException::withMessages([
                'to' => ['Você não pode transferir para si mesmo.'],
            ]);
        }

        return DB::transaction(function () use ($from, $to, $value) {
            // lock das wallets numa ordem consistente para evitar deadlock
            $firstId = min($from->id, $to->id);
            $secondId = max($from->id, $to->id);

            $firstWallet = Wallet::query()->where('user_id', $firstId)->lockForUpdate()->first();
            if (! $firstWallet) {
                $firstWallet = Wallet::create(['user_id' => $firstId, 'balance' => 0]);
                $firstWallet = Wallet::query()->where('user_id', $firstId)->lockForUpdate()->firstOrFail();
            }

            $secondWallet = Wallet::query()->where('user_id', $secondId)->lockForUpdate()->first();
            if (! $secondWallet) {
                $secondWallet = Wallet::create(['user_id' => $secondId, 'balance' => 0]);
                $secondWallet = Wallet::query()->where('user_id', $secondId)->lockForUpdate()->firstOrFail();
            }

            $fromWallet = ($from->id === $firstId) ? $firstWallet : $secondWallet;
            $toWallet   = ($to->id === $firstId) ? $firstWallet : $secondWallet;

            if ((float)$fromWallet->balance < $value) {
                throw ValidationException::withMessages([
                    'amount' => ['Saldo insuficiente para realizar a transferência.'],
                ]);
            }

            $fromWallet->balance = (float)$fromWallet->balance - $value;
            $fromWallet->save();

            $toWallet->balance = (float)$toWallet->balance + $value;
            $toWallet->save();

            return Transaction::create([
                'type' => Transaction::TYPE_TRANSFER,
                'status' => Transaction::STATUS_COMPLETED,
                'amount' => $value,
                'from_user_id' => $from->id,
                'to_user_id' => $to->id,
                'reference_id' => null,
                'meta' => null,
            ]);
        });
    }
}
