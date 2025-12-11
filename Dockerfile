# Build Stage: Compile Frontend Assets
FROM node:20 AS node_build
WORKDIR /app
COPY package*.json ./
COPY vite.config.ts ./
RUN npm ci
COPY resources ./resources
COPY public ./public
# Copy other necessary files for build if referenced in vite config
COPY . . 
RUN npm run build

# Production Stage: PHP & Nginx
FROM serversideup/php:8.2-fpm-nginx

# Set working directory
WORKDIR /var/www/html

# Switch to root to install dependencies and modify permissions
USER root

# Install system dependencies if needed (e.g. for specific PHP extensions)
# The base image already has most common extensions

# Copy project files
COPY . .

# Copy built assets from node_build stage
COPY --from=node_build /app/public/build ./public/build

# Install Composer dependencies (no-dev for production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Fix permissions
RUN chown -R webuser:webuser /var/www/html/storage /var/www/html/bootstrap/cache

# Switch back to non-root user
USER webuser

# Expose port (Render sets PORT env var, serversideup image listens on 8080 by default but can be configured)
EXPOSE 8080
