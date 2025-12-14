docker run --rm -it -v "${PWD}\api_tmp:/var/www/html" -w /var/www/html composer:2 composer create-project laravel/laravel .

docker compose up -d --build api

docker compose ps

docker compose exec api sh

composer require laravel/sanctum

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

php artisan migrate

docker compose exec api php artisan optimize:clear

docker compose up -d --build front

docker compose up --build

docker compose restart

php artisan make:migration

php artian migrate:status