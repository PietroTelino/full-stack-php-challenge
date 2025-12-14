<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Catch-all para preflight
Route::options('/{any}', function (Request $request) {
    return response()->noContent();
})->where('any', '.*');
