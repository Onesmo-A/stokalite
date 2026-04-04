<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core auth & permissions
        $this->call(DefaultPermissionsSeeder::class);
        $this->call(DefaultRoleSeeder::class);
        $this->call(DefaultPermissionEmailReportQuotationSeeder::class);
        $this->call(AddDashboardAndSettingPermissionsSeeder::class);
        $this->call(AddPurchaseAndSalePermissionsSeeder::class);
        $this->call(AddPurchaseReturnAndSaleReturnPermissionsSeeder::class);
        $this->call(AddAdjustmentAndTransferPermissionsSeeder::class);
        $this->call(AddSmsPermissionsSeeder::class);
        $this->call(AssignAllPermissionAdminRole::class);

        // Default admin
        $this->call(DefaultUserSeeder::class);

        // Reference data
        $this->call(DefaultLanguageTableSeeder::class);
        $this->call(DefaultBaseUnitSeeder::class);
        $this->call(AddIsDefaultBaseUnitTableSeeder::class);
        $this->call(DefaultCountriesSeeder::class);

        // System settings
        $this->call(SettingTableSeeder::class);
        $this->call(DefaultSettingsCountryStatePostcodeSeeder::class);
        $this->call(DefaultSettingCurrencyRightSeeder::class);
        $this->call(DefaultSettingDateFormatSeeder::class);
        $this->call(AddDefaultSettingPostcodeSeeder::class);
        $this->call(AddSettingPrefixCodeSeeder::class);
        $this->call(AddVersionFooterKeySettingTableSeeder::class);

        // Templates
        $this->call(DefaultEmailTemplateSeeder::class);
        $this->call(DefaultSmsSettingsSeeder::class);
        $this->call(DefaultSmsTemplateSeeder::class);
    }
}