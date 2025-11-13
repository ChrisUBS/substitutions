<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'course_count',
    ];

    // Relationship with Cohort
    public function cohort()
    {
        return $this->hasMany(Cohort::class, 'id_program');
    }

    // Relationship with Course
    public function course()
    {
        return $this->hasMany(Course::class, 'id_program');
    }
}