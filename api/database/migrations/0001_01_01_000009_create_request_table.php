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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['in process', 'pending payment', 'paid', 'rejected'])->nullable();
            $table->string('session');
            $table->json('absence_details');
            $table->string('lesson_plan')->nullable();
            $table->json('activities_and_assignments')->nullable();
            $table->json('materials_needed')->nullable();
            $table->string('special_instructions')->nullable();
            $table->string('substitute_observations')->nullable();
            $table->string('requeste_manager_observations')->nullable();
            $table->foreignId('id_substitute')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_cohort_course')->constrained('cohort_courses')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
