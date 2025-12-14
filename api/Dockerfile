FROM php:8.4-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    git curl unzip icu-dev oniguruma-dev libzip-dev postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

CMD sh -lc "composer install && \
    php artisan migrate --force || true && \
    php artisan serve --host=0.0.0.0 --port=8000"
