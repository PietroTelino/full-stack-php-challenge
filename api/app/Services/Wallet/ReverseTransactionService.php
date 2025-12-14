<?php

namespace App\Services\Wallet;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReverseTransactionService
{
    public function handle(User $actor, Transaction $original, ?string $reason = null): Transaction
    {
        if ($original->status !== Transaction::STATUS_COMPLETED) {
            throw ValidationException::withMessages([
                'transaction' => ['Transação não elegível para reversão.'],
            ]);
        }

        $already = Transaction::query()
            ->where('type', Transaction::TYPE_REVERSAL)
            ->where('reference_id', $original->id)
            ->exists();

        if ($already) {
            throw ValidationException::withMessages([
                'transaction' => ['Essa transação já foi revertida.'],
            ]);
        }

        return DB::transaction(function () use ($actor, $original, $reason) {
            if ($original->type === Transaction::TYPE_DEPOSIT) {
                if (! $original->to_user_id) {
                    throw ValidationException::withMessages(['transaction' => ['Depósito inválido.']]);
                }

                $toWallet = Wallet::query()->where('user_id', $original->to_user_id)->lockForUpdate()->first();
                if (! $toWallet) {
                    $toWallet = Wallet::create(['user_id' => $original->to_user_id, 'balance' => 0]);
                    $toWallet = Wallet::query()->where('user_id', $original->to_user_id)->lockForUpdate()->firstOrFail();
                }

                $toWallet->balance = (float)$toWallet->balance - (float)$original->amount;
                $toWallet->save();

                $original->status = Transaction::STATUS_REVERSED;
                $original->save();

                return Transaction::create([
                    'type' => Transaction::TYPE_REVERSAL,
                    'status' => Transaction::STATUS_COMPLETED,
                    'amount' => (float)$original->amount,
                    'from_user_id' => $original->to_user_id,
                    'to_user_id' => null,
                    'reference_id' => $original->id,
                    'meta' => [
                        'reason' => $reason,
                        'reversed_by' => $actor->id,
                    ],
                ]);
            }

            if ($original->type === Transaction::TYPE_TRANSFER) {
                if (! $original->from_user_id || ! $original->to_user_id) {
                    throw ValidationException::withMessages(['transaction' => ['Transferência inválida.']]);
                }

                $firstId = min($original->from_user_id, $original->to_user_id);
                $secondId = max($original->from_user_id, $original->to_user_id);

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

                $fromWallet = ($original->from_user_id === $firstId) ? $firstWallet : $secondWallet;
                $toWallet   = ($original->to_user_id === $firstId) ? $firstWallet : $secondWallet;

                if ((float)$toWallet->balance < (float)$original->amount) {
                    throw ValidationException::withMessages([
                        'transaction' => ['Saldo insuficiente do destinatário para reversão.'],
                    ]);
                }

                $toWallet->balance = (float)$toWallet->balance - (float)$original->amount;
                $toWallet->save();

                $fromWallet->balance = (float)$fromWallet->balance + (float)$original->amount;
                $fromWallet->save();

                $original->status = Transaction::STATUS_REVERSED;
                $original->save();

                return Transaction::create([
                    'type' => Transaction::TYPE_REVERSAL,
                    'status' => Transaction::STATUS_COMPLETED,
                    'amount' => (float)$original->amount,
                    'from_user_id' => $original->to_user_id,
                    'to_user_id' => $original->from_user_id,
                    'reference_id' => $original->id,
                    'meta' => [
                        'reason' => $reason,
                        'reversed_by' => $actor->id,
                    ],
                ]);
            }

            throw ValidationException::withMessages([
                'transaction' => ['Tipo de transação não suportado para reversão.'],
            ]);
        });
    }
}
