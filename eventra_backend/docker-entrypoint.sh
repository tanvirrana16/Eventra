#!/bin/sh
set -e

# Run composer install if vendor doesn't exist or is empty
if [ ! -d "vendor" ]; then
    echo "Running composer install..."
    composer install --no-interaction --optimize-autoloader
fi

# Run key generate if APP_KEY is empty in .env
if [ -f .env ]; then
    if grep -q "APP_KEY=$" .env || ! grep -q "APP_KEY=" .env; then
        echo "Generating application key..."
        php artisan key:generate
    fi
else
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    php artisan key:generate
fi

# Run storage:link if public/storage does not exist
if [ ! -L "public/storage" ] && [ ! -d "public/storage" ]; then
    echo "Creating storage symlink..."
    php artisan storage:link
fi

# Install npm dependencies and build assets if public/build doesn't exist
if [ ! -d "public/build" ]; then
    echo "Building backend assets..."
    npm install
    npm run build
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Execute the container's main command
exec "$@"
