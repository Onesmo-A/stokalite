# syntax=docker/dockerfile:1

### 1) JS build (Laravel Mix)
FROM node:20-alpine AS js
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources ./resources
COPY webpack.mix.js webpack-rtl.config.js .
RUN mkdir -p public
# Mix expects public/ as output
RUN npm run production

### 2) PHP deps (Composer)
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

### 3) Runtime (nginx + php-fpm)
FROM php:8.2-fpm-alpine AS app

# System deps
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    icu-libs icu-dev \
    libzip libzip-dev \
    oniguruma-dev \
    freetype-dev libjpeg-turbo-dev libpng-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql pdo_pgsql \
        intl \
        zip \
        exif \
        gd \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/html

# App source
COPY . .

# Vendor + built assets
COPY --from=vendor /app/vendor ./vendor
COPY --from=js /app/public ./public

# Nginx/PHP config
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh \
    && mkdir -p /run/nginx \
    && mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["/start.sh"]
