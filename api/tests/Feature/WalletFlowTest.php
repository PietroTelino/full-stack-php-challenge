<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WalletFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_wallet_balance(): void
    {
        $user = User::factory()->create();
        Wallet::query()->create(['user_id' => $user->id, 'balance' => 0]);

        Sanctum::actingAs($user);

        $this->getJson('/api/wallet')
            ->assertOk()
            ->assertJsonStructure(['balance']);
    }

    public function test_user_can_deposit_and_balance_increases(): void
    {
        $user = User::factory()->create();
        Wallet::query()->create(['user_id' => $user->id, 'balance' => 0]);

        Sanctum::actingAs($user);

        $this->postJson('/api/wallet/deposit', ['amount' => 50])
            ->assertStatus(201);

        $senderWallet = Wallet::query()->where('user_id', $user->id)->firstOrFail();
        $this->assertEquals(50.0, (float) $senderWallet->balance);
    }

    public function test_user_can_transfer_to_another_user_and_balances_update(): void
    {
        $sender = User::factory()->create(['email' => 'sender@email.com']);
        $receiver = User::factory()->create(['email' => 'receiver@email.com']);

        Wallet::query()->create(['user_id' => $sender->id, 'balance' => 100]);
        Wallet::query()->create(['user_id' => $receiver->id, 'balance' => 0]);

        Sanctum::actingAs($sender);

        $this->postJson('/api/wallet/transfer', [
            'to_email' => $receiver->email,
            'amount' => 30,
        ])->assertStatus(201);

        $senderWallet = Wallet::query()->where('user_id', $sender->id)->firstOrFail();
        $receiverWallet = Wallet::query()->where('user_id', $receiver->id)->firstOrFail();

        $this->assertEquals(70.0, (float) $senderWallet->balance);
        $this->assertEquals(30.0, (float) $receiverWallet->balance);
    }
}
