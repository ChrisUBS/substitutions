<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'System administrator with full access'
            ],
            [
                'name' => 'manager',
                'description' => 'Manager responsible for system management'
            ],
            [
                'name' => 'instructor',
                'description' => 'Professor who teach courses'
            ],
            [
                'name' => 'substitute',
                'description' => 'Professor who temporarily replaces another instructor'
            ]
        ];
        
        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}