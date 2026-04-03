# Stokalite (Laravel 10)

Mradi huu ni **Laravel 10** (PHP ^8.1) na una folder muhimu `public/` ambayo ndiyo inatakiwa kuwa *document root* ya web server.

## Structure (muhtasari)

- `public/` : entry point (`public/index.php`) + assets + `.htaccess` ya Laravel
- `app/` : controllers, models, services, etc.
- `routes/` : `web.php`, `api.php`, n.k.
- `resources/` : Blade / JS / CSS source
- `database/` : migrations/seeders (kuna pia `database/pos.sql`)
- `storage/` : logs, cache, uploads (isiwekwe public)
- `vendor/` : PHP dependencies (Composer)
- `node_modules/` : JS dependencies (Node)

> Kumbuka: folder `zzz htdocs/` inaonekana ni backup ya XAMPP/htdocs; **haitakiwi** ku-deploy kwenye server.

## Ku-run bila XAMPP (local, kutoka sehemu yoyote)

Mahitaji:
- PHP 8.1+ (CLI)
- Composer
- Database (MySQL/MariaDB) au ubadilishe kutumia SQLite
- Node.js + npm (kwa ku-build frontend)

Hatua (Windows/macOS/Linux):

```bash
composer install
copy .env.example .env   # Windows (au `cp` kwenye Linux/macOS)
php artisan key:generate
php artisan migrate --seed
npm ci
npm run prod   # au `npm run production`
php artisan serve --host=127.0.0.1 --port=8000
```

Kisha fungua: `http://127.0.0.1:8000`

## Ku-run ndani ya Apache (XAMPP/WAMP/LAMP)

Chaguo bora (recommended):
- Tengeneza VirtualHost na uweke `DocumentRoot` iwe `.../stokalite/public`

Chaguo rahisi (bila VirtualHost):
- Unaweza kuiweka mradi ndani ya folder yoyote iliyo chini ya web root (mfano `htdocs/stokalite`), halafu ufungue:
  - `http://localhost/stokalite`

Ukifanya hivi, hakikisha kwenye `.env` unaweka:
- `APP_URL=http://localhost/stokalite`

## Deploy kwenye shared hosting

Chaguo bora (kama hosting inaruhusu kubadili document root):
- Weka domain/subdomain *document root* iwe `public/`.

Kama huwezi kubadili document root (common kwenye shared hosting):
1) Weka project nzima juu ya `public_html` (mfano `stokalite/`)
2) Nakili yaliyomo ya `stokalite/public/` kwenda `public_html/`
3) Hariri `public_html/index.php` (paths) ili ionyeshe `stokalite/`:

```php
require __DIR__.'/../stokalite/vendor/autoload.php';
$app = require_once __DIR__.'/../stokalite/bootstrap/app.php';
```

4) Hakikisha `.env` ya production iko sawa (`APP_URL`, DB, mail, n.k.)
5) Run (kwa SSH) `php artisan storage:link` au tengeneza symlink/shortcut ya `public/storage`

## Notes muhimu

- `vendor/` na `node_modules/` usivi-upload bila sababu; kwa shared hosting yenye SSH tumia `composer install --no-dev --optimize-autoloader`.
- Usiiweke `storage/` au `.env` kuwa public.