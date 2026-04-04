#!/usr/bin/env bash
set -euo pipefail

export PORT="${PORT:-10000}"

# Render (and most reverse proxies) terminate TLS before your container.
# This ensures Laravel generates https URLs correctly.
export TRUSTED_PROXIES="${TRUSTED_PROXIES:-*}"

# Generate nginx config from template (inject PORT)
mkdir -p /etc/nginx/conf.d
if command -v envsubst >/dev/null 2>&1; then
  envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
else
  # fallback: simple replace
  sed "s/\${PORT}/${PORT}/g" /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
fi

# Laravel permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

# App bootstrap
if [ -f /var/www/html/artisan ]; then
  php /var/www/html/artisan storage:link >/dev/null 2>&1 || true

  if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php /var/www/html/artisan migrate --force
  fi

  php /var/www/html/artisan package:discover --ansi || true

  php /var/www/html/artisan config:cache || true
  php /var/www/html/artisan route:cache || true
  php /var/www/html/artisan view:cache || true
fi

exec /usr/bin/supervisord -c /etc/supervisord.conf
