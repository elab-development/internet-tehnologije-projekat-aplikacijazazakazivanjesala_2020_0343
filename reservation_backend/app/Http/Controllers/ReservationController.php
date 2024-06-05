<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;



class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::all();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $rules = [
            'user_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'status' => 'required|in:reserved,canceled,pending',
        ];

        $messages = [
            'user_id.exists' => 'The selected user does not exist.',
            'room_id.exists' => 'The selected room does not exist.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 404);
        }

        $validatedData = $validator->validated();

        $conflict = Reservation::where('room_id', $validatedData['room_id'])
            ->where('date', $validatedData['date'])
            ->where(function ($query) use ($validatedData) {
                $query->where(function ($query) use ($validatedData) {
                    $query->where('start_time', '<', $validatedData['end_time'])
                        ->where('end_time', '>', $validatedData['start_time']);
                });
            })->exists();

        if ($conflict) {
            return response()->json(['error' => 'Room is not available in the provided time slot'], 409);
        }

        $reservation = Reservation::create($validatedData);

        return response()->json($reservation, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $reservation = Reservation::findOrFail($id);
        return response()->json($reservation);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['error' => 'Reservation is not found'], 404);
        }

        $rules = [
            'user_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'status' => 'required|in:reserved,canceled,pending',
        ];

        $messages = [
            'user_id.exists' => 'The selected user does not exist.',
            'room_id.exists' => 'The selected room does not exist.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $conflict = Reservation::where('room_id', $validatedData['room_id'])
            ->where('date', $validatedData['date'])
            ->where('id', '!=', $id)  // Exclude the current reservation
            ->where(function ($query) use ($validatedData) {
                $query->where(function ($query) use ($validatedData) {
                    $query->where('start_time', '<', $validatedData['end_time'])
                        ->where('end_time', '>', $validatedData['start_time']);
                });
            })->exists();

        if ($conflict) {
            return response()->json(['error' => 'Room is not available in the provided time slot'], 409);
        }

        $reservation->update($validatedData);

        return response()->json($reservation);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function getReservationsByRoomAndDateRange(Request $request)
    {
        $rules = [
            'room_id' => 'required|exists:rooms,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];

        $messages = [
            'room_id.exists' => 'The selected room does not exist.',
            'end_date.after_or_equal' => 'The end date must be equal to or after the start date.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $reservations = Reservation::where('room_id', $validatedData['room_id'])
            ->whereBetween('date', [$validatedData['start_date'], $validatedData['end_date']])
            ->get();

        return response()->json($reservations, Response::HTTP_OK);
    }
}
