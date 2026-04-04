<?php

namespace Database\Seeders;

use App\Models\Language;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DefaultLanguageTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionExists = Permission::where('name', 'manage_language')->exists();

        if (! $permissionExists) {
            Permission::create([
                'name' => 'manage_language',
                'display_name' => 'Manage Language',
            ]);
        }

        $adminRole = Role::whereName(Role::ADMIN)->first();

        if (empty($adminRole)) {
            $adminRole = Role::create([
                'name' => 'admin',
                'display_name' => ' Admin',
            ]);
        }

        $permission = Permission::where('name', 'manage_language')->pluck('name', 'id');
        $adminRole->givePermissionTo($permission);

        $languages = [
            ['name' => 'Arabic', 'iso_code' => 'ar', 'is_default' => false],
            ['name' => 'Chinese', 'iso_code' => 'cn', 'is_default' => false],
            ['name' => 'English', 'iso_code' => 'en', 'is_default' => true],
            ['name' => 'French', 'iso_code' => 'fr', 'is_default' => false],
            ['name' => 'German', 'iso_code' => 'gr', 'is_default' => false],
            ['name' => 'Spanish', 'iso_code' => 'sp', 'is_default' => false],
            ['name' => 'Turkish', 'iso_code' => 'tr', 'is_default' => false],
            ['name' => 'Vietnamese', 'iso_code' => 'vi', 'is_default' => false],
        ];

        foreach ($languages as $language) {
            Language::updateOrCreate(
                ['iso_code' => $language['iso_code']],
                $language
            );
        }

        // Ensure only one default language
        Language::where('iso_code', '!=', 'en')->update(['is_default' => false]);
        Language::where('iso_code', 'en')->update(['is_default' => true]);
    }
}