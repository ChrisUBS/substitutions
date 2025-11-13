<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'session',
        'absence_details',
        'lesson_plan',
        'activities_and_assignments',
        'materials_needed',
        'special_instructions',
        'substitute_observations',
        'request_manager_observations',
        'timestamp',
        'id_substitute',
        'id_cohort_course'
    ];

    // Relationship with User (substitute)
    public function substitute()
    {
        return $this->belongsTo(User::class, 'id_substitute');
    }

    // Relationship with CohortCourse
    public function cohortCourse()
    {
        return $this->belongsTo(CohortCourse::class, 'id_cohort_course');
    }
}