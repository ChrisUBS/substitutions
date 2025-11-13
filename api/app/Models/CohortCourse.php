<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CohortCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_name',
        'instructor_name',
        'monetary_value',
        'remaining_amount',
        'id_cohort',
        'id_course'
    ];

    // Relationship with Cohort
    public function cohort()
    {
        return $this->belongsTo(Cohort::class, 'id_cohort');
    }

    // Relationship with Course
    public function course()
    {
        return $this->belongsTo(Course::class, 'id_course');
    }

    // Relationship with Request
    public function request()
    {
        return $this->hasMany(Request::class, 'id_cohort_course');
    }

    // Relationship with DiscountHistory
    public function discountHistory()
    {
        return $this->hasMany(DiscountHistory::class, 'id_cohort_course');
    }

    // Model Events
    // protected static function booted()
    // {
    // }
}