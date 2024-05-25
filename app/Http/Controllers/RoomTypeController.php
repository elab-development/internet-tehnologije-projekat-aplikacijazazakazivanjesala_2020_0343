<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomTypeRequest;
use App\Models\RoomType;
use Illuminate\Http\Response;

class RoomTypeController extends Controller
{

    public function index()
    {
        $roomTypes = RoomType::all();
        return response()->json($roomTypes, Response::HTTP_OK);
    }


    public function store(RoomTypeRequest $request)
    {

        $roomType = RoomType::create($request->all());
        return response()->json($roomType, Response::HTTP_CREATED);
    }


    public function show($id)
    {
        $roomType = RoomType::find($id);
        return response()->json($roomType, Response::HTTP_OK);
    }


    public function update(RoomTypeRequest $request, $id)
    {

        $roomType = RoomType::find($id);
        $roomType->update($request->all());

        return response()->json($roomType, Response::HTTP_OK);
    }


    public function destroy($id)
    {
        RoomType::destroy($id);
        return response()->json(Response::HTTP_NO_CONTENT);
    }
}
