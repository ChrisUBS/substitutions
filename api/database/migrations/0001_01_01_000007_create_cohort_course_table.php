<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cohort_courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_name');
            $table->string('instructor_name');
            $table->float('monetary_value', 8, 2);
            $table->float('remaining_amount', 8, 2);
            $table->foreignId('id_cohort')->constrained('cohorts')->onDelete('cascade');
            $table->foreignId('id_course')->nullable()->constrained('courses')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cohort_courses');
    }
};
