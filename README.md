# WebbitMQ

A powerful, web-based RabbitMQ monitoring and management tool that allows you to catch, record, and analyze RabbitMQ messages on demand.

![WebbitMQ Logo](frontend/logo192.png)

## Features

- **Message Capture**: Catch and record RabbitMQ messages on demand
- **Real-time Monitoring**: Monitor RabbitMQ queues and servers in real-time
- **Queue Management**: Create, configure, and delete queues through a user-friendly interface
- **Message Replay**: Copy and replay messages from history
- **WebSocket Support**: Get real-time updates without page refreshes
- **Server Management**: Connect to and manage multiple RabbitMQ servers

## Requirements

- **Redis**: Required for storing message history and application state. The Docker Compose setup includes Redis by default.
- **RabbitMQ**: The system you want to monitor

## Architecture

WebbitMQ consists of:
- A Python backend built with FastAPI
- A React frontend written in TypeScript
- Nginx for serving static content and proxying API requests
- Redis for caching and message storage
- RabbitMQ integration for message processing

## Deployment

### Using Docker Compose

The easiest way to deploy WebbitMQ is using Docker Compose with the pre-built Docker image:

1. Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.7'
services:
  app:
    image: bushig/webbitmq:latest
    ports:
      - 8000:80
    volumes:
      - ./data:/app/backend/data  # For SQLite database persistence
    environment:
      DB_CONNECTION: sqlite:///data/db.sqlite3
      PYTHONPATH: /app/backend
    depends_on:
      - redis

  redis:
    image: redis:7.2.4-alpine
    volumes:
      - redis_data:/data  # For Redis persistence
    command: redis-server --appendonly yes  # Enable AOF persistence

  # RabbitMQ service (commented out by default)
  # This is only for demonstration and testing. For production use,
  # you'll typically connect to your existing RabbitMQ instances.
  # rabbit:
  #   image: rabbitmq:3.8.14-management-alpine
  #   ports:
  #   - 15672:15672
  #   - 5672:5672
  #   logging:
  #     driver: none

volumes:
  redis_data:  # Named volume for Redis data
```

2. Start the services:
```bash
docker-compose up -d
```

3. Access WebbitMQ at http://localhost:8000

### Building from Source

If you prefer to build WebbitMQ from source:

```bash
# Clone the repository
git clone https://github.com/yourusername/webbitmq.git
cd webbitmq
# Build and start the production environment
docker-compose -f docker-compose.prod.yml up -d
```

### Data Persistence

WebbitMQ uses SQLite for database storage and Redis for message history. The docker-compose setup includes volume configuration for data persistence.

## Development

### Starting developer environment

```bash
make up
```

### Development Prerequisites

Before starting development, you'll need to install:

1. **uv**:
   - Installation: [uv installation guide](https://github.com/astral-sh/uv#installation)

2. **pre-commit**:
   - Installation: [pre-commit installation guide](https://pre-commit.com/#installation)
   - After installation, run `pre-commit install` in the project root

After making changes to dependencies in pyproject.toml, update the lock file using:
```bash
make lock
```

### Project Structure

- `backend/`: Python backend using FastAPI
- `frontend/`: React/TypeScript frontend
- `nginx/`: Nginx configuration files

### Running Tests

```bash
# Run tests
make test

# Run linting
make lint
```

## Environment Variables

### Backend Configuration
- `DB_CONNECTION`: Database connection string (default: sqlite://db.sqlite3)
- `PYTHONPATH`: Python path
- `PYTHONASYNCIODEBUG`: Set to 1 for async debugging

### Frontend Configuration
- `NODE_ENV`: Set to "development" for development mode
- `CHOKIDAR_USEPOLLING`: Enable file watching in Docker

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.
