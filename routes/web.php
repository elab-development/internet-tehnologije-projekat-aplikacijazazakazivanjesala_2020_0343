<?php

use App\Http\Controllers\RoomTypeController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/room-types', [RoomTypeController::class, 'index']);
Route::get('/room-types/{id}', [RoomTypeController::class, 'show']);
Route::post('/room-types', [RoomTypeController::class, 'store']);
Route::put('/room-types/{id}', [RoomTypeController::class, 'update']);
Route::delete('/room-types/{id}', [RoomTypeController::class, 'destroy']);
