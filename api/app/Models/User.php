<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use hasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'salary',
        'email_verified_at',
        'must_change_password',
        'id_role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Role relationship
    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role');
    }

    // Course relationship
    public function course()
    {
        return $this->hasMany(Course::class, 'id_instructor');
    }

    // Request relationship
    public function request()
    {
        return $this->hasMany(Request::class, 'id_substitute');
    }

    /**
     * Check if the user has a specific role
     */
    public function hasRole($roleName){
        return $this->id_role->name === $roleName;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'email_verified_at' => 'datetime',
        ];
    }
}
