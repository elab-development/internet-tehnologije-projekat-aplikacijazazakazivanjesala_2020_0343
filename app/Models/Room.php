<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'num_of_seats',
        'num_of_computers',
        'area',
        'floor',
        'room_type_id'
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
    public $timestamps = false;
}
