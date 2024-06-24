<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RoomType;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RoomType::create(['name' => 'Lecture Hall']);
        RoomType::create(['name' => 'Computer Lab']);
        RoomType::create(['name' => 'Seminar Room']);
        RoomType::create(['name' => 'Meeting Room']);
    }
}
