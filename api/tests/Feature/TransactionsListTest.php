<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransactionsListTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_transactions(): void
    {
        $user = User::factory()->create();
        Wallet::query()->create(['user_id' => $user->id, 'balance' => 0]);

        Sanctum::actingAs($user);

        $this->postJson('/api/wallet/deposit', ['amount' => 50])
            ->assertStatus(201);

        $this->getJson('/api/transactions')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'status',
                        'amount',
                        'from_user_id',
                        'to_user_id',
                        'created_at',
                    ],
                ],
            ]);
    }
}
