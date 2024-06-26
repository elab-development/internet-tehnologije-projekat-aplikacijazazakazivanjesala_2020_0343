<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;





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

    public function getUserReservations($user_id)
    {

        $validator = Validator::make(['user_id' => $user_id], [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reservations = Reservation::where('user_id', $user_id)
            ->with('room:id,name')
            ->get();

        $response = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'room_id' => $reservation->room_id,
                'room_name' => $reservation->room->name,
                'title' => $reservation->title,
                'description' => $reservation->description,
                'date' => $reservation->date,
                'start_time' => $reservation->start_time,
                'end_time' => $reservation->end_time,
                'status' => $reservation->status,
            ];
        });

        return response()->json($response, 200);
    }

    public function getAvailableReservations(Request $request)
    {
        $rules = [
            'capacity' => 'required|integer|min:0',
            'date' => 'required|date',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $rooms = Room::where('num_of_seats', '>=', $validatedData['capacity'])->get(['id', 'name', 'num_of_seats']);

        $reservations = Reservation::whereIn('room_id', $rooms->pluck('id'))
            ->where('date', $validatedData['date'])
            ->orderBy('start_time')
            ->get();

        $workingHoursStart = Carbon::createFromTimeString('08:00');
        $workingHoursEnd = Carbon::createFromTimeString('22:00');

        $availableSlots = [];

        foreach ($rooms as $room) {
            $currentStartTime = clone $workingHoursStart;

            $roomReservations = $reservations->where('room_id', $room->id);

            foreach ($roomReservations as $reservation) {
                $reservationStartTime = Carbon::createFromTimeString($reservation->start_time);
                $reservationEndTime = Carbon::createFromTimeString($reservation->end_time);

                if ($currentStartTime < $reservationStartTime) {
                    $availableSlots[] = [
                        'room_id' => $room->id,
                        'room_name' => $room->name,
                        'num_of_seats' => $room->num_of_seats,
                        'date' => $validatedData['date'],
                        'start_time' => $currentStartTime->format('H:i'),
                        'end_time' => $reservationStartTime->format('H:i'),
                    ];
                }

                $currentStartTime = $reservationEndTime;
            }

            if ($currentStartTime < $workingHoursEnd) {
                $availableSlots[] = [
                    'room_id' => $room->id,
                    'room_name' => $room->name,
                    'num_of_seats' => $room->num_of_seats,
                    'date' => $validatedData['date'],
                    'start_time' => $currentStartTime->format('H:i'),
                    'end_time' => $workingHoursEnd->format('H:i'),
                ];
            }
        }

        return response()->json($availableSlots, 200);
    }

    public function exportReservations()
    {
        $reservations = Reservation::with('room')->get();

        $htmlContent = '<h1>Reservations</h1>';
        $htmlContent .= '<table style="width: 100%; border-collapse: collapse;">';
        $htmlContent .= '<thead>
            <tr>
                <th style="border: 1px solid #000; padding: 8px;">ID</th>
                <th style="border: 1px solid #000; padding: 8px;">Room ID</th>
                <th style="border: 1px solid #000; padding: 8px;">Room Name</th>
                <th style="border: 1px solid #000; padding: 8px;">User ID</th>
                <th style="border: 1px solid #000; padding: 8px;">Title</th>
                <th style="border: 1px solid #000; padding: 8px;">Description</th>
                <th style="border: 1px solid #000; padding: 8px;">Date</th>
                <th style="border: 1px solid #000; padding: 8px;">Start Time</th>
                <th style="border: 1px solid #000; padding: 8px;">End Time</th>
                <th style="border: 1px solid #000; padding: 8px;">Status</th>
            </tr>
        </thead>';
        $htmlContent .= '<tbody>';
        foreach ($reservations as $reservation) {
            $htmlContent .= '<tr>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->id . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->room_id . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->room->name . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->user_id . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->title . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->description . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->date . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->start_time . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->end_time . '</td>
                <td style="border: 1px solid #000; padding: 8px;">' . $reservation->status . '</td>
            </tr>';
        }
        $htmlContent .= '</tbody></table>';

        $pdf = PDF::loadHTML($htmlContent);

        $filePath = 'reservations.pdf';
        Storage::put($filePath, $pdf->output());

        return response()->download(storage_path('app/' . $filePath));
    }
}
