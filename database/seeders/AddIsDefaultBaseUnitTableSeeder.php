<?php

namespace Database\Seeders;

use App\Models\BaseUnit;
use Illuminate\Database\Seeder;

class AddIsDefaultBaseUnitTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = ['piece', 'meter', 'kilogram'];

        foreach ($names as $name) {
            $baseUnit = BaseUnit::whereName($name)->first();
            if (! empty($baseUnit)) {
                $baseUnit->update([
                    'is_default' => true,
                ]);
            }
        }
    }
}