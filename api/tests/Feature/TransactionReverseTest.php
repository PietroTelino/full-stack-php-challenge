<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransactionReverseTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_reverse_own_deposit(): void
    {
        $user = User::factory()->create();
        Wallet::query()->create(['user_id' => $user->id, 'balance' => 0]);

        Sanctum::actingAs($user);

        $depositRes = $this->postJson('/api/wallet/deposit', ['amount' => 50])
            ->assertStatus(201)
            ->json();

        $txId = $depositRes['transaction']['id'] ?? null;
        $this->assertNotNull($txId);

        $this->postJson("/api/transactions/{$txId}/reverse")
            ->assertStatus(201);

        $wallet = Wallet::query()->where('user_id', $user->id)->firstOrFail();
        $this->assertEquals(0.0, (float) $wallet->balance);
    }

    public function test_sender_can_reverse_transfer_and_balances_restore(): void
    {
        $sender = User::factory()->create(['email' => 'sender@email.com']);
        $receiver = User::factory()->create(['email' => 'receiver@email.com']);

        Wallet::query()->create(['user_id' => $sender->id, 'balance' => 100]);
        Wallet::query()->create(['user_id' => $receiver->id, 'balance' => 0]);

        Sanctum::actingAs($sender);

        $transferRes = $this->postJson('/api/wallet/transfer', [
            'to_email' => $receiver->email,
            'amount' => 30,
        ])->assertStatus(201)->json();

        $txId = $transferRes['transaction']['id'] ?? null;
        $this->assertNotNull($txId);

        $this->postJson("/api/transactions/{$txId}/reverse")
            ->assertStatus(201);

        $senderWallet = Wallet::query()->where('user_id', $sender->id)->firstOrFail();
        $receiverWallet = Wallet::query()->where('user_id', $receiver->id)->firstOrFail();

        $this->assertEquals(100.0, (float) $senderWallet->balance);
        $this->assertEquals(0.0, (float) $receiverWallet->balance);
    }
}
