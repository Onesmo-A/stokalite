<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
['email' => 'admin@stoka.com'],
            [
'first_name' => 'Stoka Admin',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('123456'),
            ]
        );

        /** @var Role $adminRole */
        $adminRole = Role::whereName('admin')->first();
        if ($user && $adminRole && ! $user->hasRole($adminRole)) {
            $user->assignRole($adminRole);
        }
    }
}