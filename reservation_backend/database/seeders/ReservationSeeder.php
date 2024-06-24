<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Reservation;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Reservation::create([
            'user_id' => 1,
            'room_id' => 1,
            'title' => 'Project Meeting',
            'description' => 'Discuss project milestones',
            'date' => '2024-06-20',
            'start_time' => '10:00',
            'end_time' => '11:00',
            'status' => 'reserved',
        ]);

        Reservation::create([
            'user_id' => 1,
            'room_id' => 2,
            'title' => 'Lecture',
            'description' => 'Math lecture',
            'date' => '2024-06-21',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'status' => 'reserved',
        ]);

        Reservation::create([
            'user_id' => 1,
            'room_id' => 3,
            'title' => 'Seminar',
            'description' => 'Science seminar',
            'date' => '2024-06-22',
            'start_time' => '12:00',
            'end_time' => '14:00',
            'status' => 'reserved',
        ]);

        Reservation::create([
            'user_id' => 1,
            'room_id' => 3,
            'title' => 'Meeting with coworkers',
            'description' => 'Meeting with coworkers',
            'date' => '2024-06-22',
            'start_time' => '14:00',
            'end_time' => '16:00',
            'status' => 'reserved',
        ]);

        Reservation::create([
            'user_id' => 1,
            'room_id' => 3,
            'title' => 'Project presentation',
            'description' => 'Project presentation',
            'date' => '2024-06-28',
            'start_time' => '12:00',
            'end_time' => '16:00',
            'status' => 'reserved',
        ]);
    }
}
