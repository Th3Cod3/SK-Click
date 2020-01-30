FROM php:7.2-apache

# Install dev dependencies
RUN apt-get update && \
    apt-get install -y \
    $PHPIZE_DEPS \
    libcurl4-openssl-dev \
    libmagickwand-dev \
    libtool \
    libxml2-dev

# Install production dependencies
RUN apt-get install -y \
    bash \
    curl \
    g++ \
    gcc \
    git \
    imagemagick \
    libc-dev \
    libpng-dev \
    make \
    mariadb-client \
    nodejs \
    yarn \
    openssh-client \
    rsync \
    zlib1g-dev \
    vim \
    libzip-dev

# Install PECL and PEAR extensions
RUN pecl install \
    imagick \
    xdebug

# Install and enable php extensions
RUN docker-php-ext-enable \
    imagick \
    xdebug
RUN docker-php-ext-configure zip --with-libzip
RUN docker-php-ext-install \
    curl \
    exif \
    iconv \
    mbstring \
    pdo \
    pdo_mysql \
    pcntl \
    tokenizer \
    xml \
    gd \
    zip \
    bcmath

# Install composer
ENV COMPOSER_HOME /composer
ENV PATH ./vendor/bin:/composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

# # Install PHP_CodeSniffer
# RUN composer global require "squizlabs/php_codesniffer=*"

# Setup working directory
COPY ["composer.json", "composer.json", "/var/www/html/"]
WORKDIR /var/www/html
RUN composer install
RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini && \
  a2enmod rewrite && \
  echo -e "[XDebug] \nxdebug.remote_enable = 1 \nxdebug.remote_autostart = 1" >> /usr/local/etc/php/php.ini



