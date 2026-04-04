#!/usr/bin/env bash
set -euo pipefail

export PORT="${PORT:-10000}"

# Render (and most reverse proxies) terminate TLS before your container.
# This ensures Laravel generates https URLs correctly.
export TRUSTED_PROXIES="${TRUSTED_PROXIES:-*}"

TEMPLATE_PATH="/etc/nginx/templates/default.conf.template"

# Alpine nginx includes vhosts from /etc/nginx/http.d/*.conf
# Some distros use /etc/nginx/conf.d/*.conf. Support both.
if [ -d /etc/nginx/http.d ]; then
  NGINX_VHOST_DIR="/etc/nginx/http.d"
else
  NGINX_VHOST_DIR="/etc/nginx/conf.d"
fi

mkdir -p "${NGINX_VHOST_DIR}"

if command -v envsubst >/dev/null 2>&1; then
  envsubst '${PORT}' < "${TEMPLATE_PATH}" > "${NGINX_VHOST_DIR}/default.conf"
else
  sed "s/\${PORT}/${PORT}/g" "${TEMPLATE_PATH}" > "${NGINX_VHOST_DIR}/default.conf"
fi

# Laravel runtime dirs (avoid "Please provide a valid cache path")
mkdir -p /var/www/html/bootstrap/cache
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views

# Permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R ug+rwX /var/www/html/storage /var/www/html/bootstrap/cache || true

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
