<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        AdminUser::firstOrCreate(
            ['email' => 'admin@itspdfthings.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('admin1234'),
                'role' => 'superadmin',
            ]
        );
    }
}
