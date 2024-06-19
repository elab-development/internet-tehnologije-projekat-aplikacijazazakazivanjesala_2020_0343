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
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
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
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
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

    public function filterReservations(Request $request)
    {
        $rules = [
            'room_id' => 'sometimes|exists:rooms,id',
            'title' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'capacity' => 'sometimes|min:0',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $query = Reservation::query();

        if (isset($validatedData['room_id'])) {
            $query->where('room_id', $validatedData['room_id']);
        }

        if (isset($validatedData['title'])) {
            $query->where('title', 'like', '%' . $validatedData['title'] . '%');
        }

        if (isset($validatedData['start_date']) && isset($validatedData['end_date'])) {
            $query->whereBetween('date', [$validatedData['start_date'], $validatedData['end_date']]);
        } elseif (isset($validatedData['start_date'])) {
            $query->where('date', '>=', $validatedData['start_date']);
        } elseif (isset($validatedData['end_date'])) {
            $query->where('date', '<=', $validatedData['end_date']);
        }

        if (isset($validatedData['start_time']) && isset($validatedData['end_time'])) {
            $query->where(function ($query) use ($validatedData) {
                $query->where('start_time', '>=', $validatedData['start_time'])
                    ->where('end_time', '<=', $validatedData['end_time']);
            });
        } elseif (isset($validatedData['start_time'])) {
            $query->where('start_time', '>=', $validatedData['start_time']);
        } elseif (isset($validatedData['end_time'])) {
            $query->where('end_time', '<=', $validatedData['end_time']);
        }

        $query->join('rooms', 'reservations.room_id', '=', 'rooms.id');
        if (isset($validatedData['capacity'])) {
            $query->where('rooms.num_of_seats', '>=', $validatedData['capacity']);
        }

        $reservations = $query->get();

        return response()->json($reservations, Response::HTTP_OK);
    }
}
