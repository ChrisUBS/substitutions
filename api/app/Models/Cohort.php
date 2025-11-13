<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cohort extends Model
{
    use HasFactory;

    protected $fillable = [
        'cohort_number',
        'id_program'
    ];

    // Relationship with Program
    public function program()
    {
        return $this->belongsTo(Program::class, 'id_program');
    }

    // Relationship with CohortCourse
    public function cohortCourse()
    {
        return $this->hasMany(CohortCourse::class, 'id_cohort');
    }
}