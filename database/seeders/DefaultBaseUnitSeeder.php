<?php

namespace Database\Seeders;

use App\Models\BaseUnit;
use Illuminate\Database\Seeder;

class DefaultBaseUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $baseUnits = [
            ['name' => 'piece'],
            ['name' => 'meter'],
            ['name' => 'kilogram'],
        ];

        foreach ($baseUnits as $baseUnit) {
            BaseUnit::firstOrCreate(['name' => $baseUnit['name']], $baseUnit);
        }
    }
}