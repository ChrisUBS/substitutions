<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'substitute',
        'paid',
        'id_cohort_course'
    ];

    // Relationship with CohortCourse
    public function cohortCourse()
    {
        return $this->belongsTo(CohortCourse::class, 'id_cohort_course');
    }
}