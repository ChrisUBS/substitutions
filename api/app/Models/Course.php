<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'monetary_value',
        'id_program',
        'id_instructor'
    ];

    // Relationship with User (instructor)
    public function instructor()
    {
        return $this->belongsTo(User::class, 'id_instructor');
    }

    // Relationship with Program
    public function program()
    {
        return $this->belongsTo(Program::class, 'id_program');
    }

    // Relationship with CohortCourse
    public function cohortCourse()
    {
        return $this->hasMany(CohortCourse::class, 'id_course');
    }
}