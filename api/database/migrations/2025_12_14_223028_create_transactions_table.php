<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->string('type');
            $table->string('status');

            $table->decimal('amount', 14, 2);

            $table->foreignId('from_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('to_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->foreignId('reference_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->json('meta')->nullable();

            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index(['from_user_id']);
            $table->index(['to_user_id']);
            $table->index(['reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
