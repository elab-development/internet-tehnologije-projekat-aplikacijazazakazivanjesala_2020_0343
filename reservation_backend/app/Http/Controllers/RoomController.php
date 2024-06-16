<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Response;

class RoomController extends Controller
{

    public function index()
    {
        $roomTypes = Room::all();
        return response()->json($roomTypes, Response::HTTP_OK);
    }
}
