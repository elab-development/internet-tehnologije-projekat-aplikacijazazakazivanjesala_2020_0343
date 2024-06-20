<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Room::create([
            'name' => 'Room 101',
            'num_of_seats' => 50,
            'num_of_computers' => 10,
            'area' => 100,
            'floor' => 1,
            'room_type_id' => 1,
        ]);

        Room::create([
            'name' => 'Room 102',
            'num_of_seats' => 30,
            'num_of_computers' => 30,
            'area' => 80,
            'floor' => 1,
            'room_type_id' => 2,
        ]);

        Room::create([
            'name' => 'Room 201',
            'num_of_seats' => 20,
            'num_of_computers' => 5,
            'area' => 60,
            'floor' => 2,
            'room_type_id' => 3,
        ]);

        Room::create([
            'name' => 'Room 501',
            'num_of_seats' => 25,
            'num_of_computers' => 5,
            'area' => 60,
            'floor' => 2,
            'room_type_id' => 4,
        ]);
    }
}
