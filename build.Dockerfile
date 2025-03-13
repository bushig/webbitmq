# Multi-stage build for a combined container with both backend and frontend
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files first to leverage Docker layer caching
COPY frontend/package.json frontend/package-lock.json* ./

# Use npm ci with flags for maximum speed - ensure we get devDependencies for TypeScript
RUN npm config set cache /tmp/npm-cache --global && \
    npm ci --prefer-offline --no-audit --no-fund --silent

# Copy only the necessary files for building
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/*.html frontend/*.ts frontend/*.js frontend/*.json ./

# Build the frontend
RUN npm run build

# Stage 2: Build the backend and combine with Nginx
FROM python:3.12-slim
WORKDIR /app

# Install Nginx and other dependencies - group commands to reduce layers
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for the backend - use pip cache
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend /app/backend

# Copy the built frontend from the previous stage
COPY --from=frontend-build /app/frontend/dist /app/frontend/build

# Configure Nginx
COPY nginx/combined-nginx.conf /etc/nginx/sites-available/default

# Configure supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the port
EXPOSE 80

# Start services using supervisord
CMD ["/usr/bin/supervisord"]