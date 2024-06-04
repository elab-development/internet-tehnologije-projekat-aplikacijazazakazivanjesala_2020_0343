<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/room-types', [RoomTypeController::class, 'index'])->middleware('auth:sanctum');
Route::get('/room-types/{id}', [RoomTypeController::class, 'show'])->middleware('auth:sanctum');
Route::post('/room-types', [RoomTypeController::class, 'store'])->middleware('auth:sanctum');
Route::put('/room-types/{id}', [RoomTypeController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/room-types/{id}', [RoomTypeController::class, 'destroy'])->middleware('auth:sanctum');


Route::apiResource('reservations', ReservationController::class)->middleware('auth:sanctum');