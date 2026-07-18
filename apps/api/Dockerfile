FROM php:8.3-fpm-alpine

# System deps + PDF processing tools
RUN apk add --no-cache \
    nginx \
    supervisor \
    qpdf \
    ghostscript \
    imagemagick \
    imagemagick-dev \
    libzip-dev \
    oniguruma-dev \
    autoconf \
    g++ \
    make \
    && docker-php-ext-install pdo_mysql mbstring zip pcntl posix \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for layer caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --ignore-platform-req=ext-pcntl

COPY . .
RUN composer dump-autoload --optimize \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisor config (manages php-fpm + nginx in one container)
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
