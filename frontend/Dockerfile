FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies, including devDependencies to ensure TypeScript is available
RUN npm config set cache /tmp/npm-cache --global && \
    npm ci --no-audit --no-fund

# Copy source files after installing dependencies to maintain cache
COPY . .

# Make sure TypeScript is installed and available in PATH
RUN npm list typescript || npm install --no-save typescript

EXPOSE 3000
EXPOSE 35729

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "start"]