<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Get role ID for admin
        $adminRole = Role::where('name', 'admin')->first();

        // Create an admin user
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@sdgku.edu',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'must_change_password' => false,
            'id_role' => $adminRole->id,
        ]);
    }
}