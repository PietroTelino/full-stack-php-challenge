<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WalletController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/wallet', [WalletController::class, 'show']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/transfer', [WalletController::class, 'transfer']);

    Route::get('/transactions', [WalletController::class, 'transactions']);
    Route::post('/transactions/{id}/reverse', [WalletController::class, 'reverse']);
});

Route::options('/{any}', function (Request $request) {
    return response()->noContent();
})->where('any', '.*');
