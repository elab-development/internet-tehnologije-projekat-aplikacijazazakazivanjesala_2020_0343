<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomController;
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

Route::get('/rooms', [RoomController::class, 'index'])->middleware('auth:sanctum');
Route::get('/reservations/searchDateRange', [ReservationController::class, 'getReservationsByRoomAndDateRange'])->middleware('auth:sanctum');
Route::get('/reservations/filter', [ReservationController::class, 'filterReservations']);
Route::get('/reservations/my-reservations/{user_id}', [ReservationController::class, 'getUserReservations']);

Route::get('/reservations/available', [ReservationController::class, 'getAvailableReservations']);



Route::apiResource('reservations', ReservationController::class)->middleware('auth:sanctum');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/export-reservations', [ReservationController::class, 'exportReservations'])->middleware('auth:sanctum');
