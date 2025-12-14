<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepositRequest;
use App\Http\Requests\ReverseRequest;
use App\Http\Requests\TransferRequest;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Wallet\DepositService;
use App\Services\Wallet\ReverseTransactionService;
use App\Services\Wallet\TransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        return response()->json([
            'balance' => (float) $wallet->balance,
        ]);
    }

    public function deposit(DepositRequest $request, DepositService $service): JsonResponse
    {
        $user = $request->user();
        $tx = $service->handle($user, $request->input('amount'));

        return response()->json([
            'transaction' => $tx,
        ], 201);
    }

    public function transfer(TransferRequest $request, TransferService $service): JsonResponse
    {
        $from = $request->user();

        $to = User::query()->where('email', $request->input('to_email'))->first();

        if (! $to) {
            return response()->json([
                'message' => 'Usuário destinatário não encontrado.',
            ], 404);
        }

        $tx = $service->handle($from, $to, $request->input('amount'));

        return response()->json([
            'transaction' => $tx,
        ], 201);
    }

    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();

        $items = Transaction::query()
            ->where(function ($q) use ($user) {
                $q->where('from_user_id', $user->id)
                  ->orWhere('to_user_id', $user->id);
            })
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json($items);
    }

    public function reverse(int $id, ReverseRequest $request, ReverseTransactionService $service): JsonResponse
    {
        $user = $request->user();

        $tx = Transaction::query()->findOrFail($id);

        if ($tx->from_user_id !== $user->id && $tx->to_user_id !== $user->id) {
            return response()->json([
                'message' => 'Você não tem permissão para reverter esta transação.',
            ], 403);
        }

        $reversal = $service->handle($user, $tx, $request->input('reason'));

        return response()->json([
            'transaction' => $reversal,
        ], 201);
    }
}
