# Docker Configuration for Seder.ai

This repository contains Docker configuration files for running the Seder.ai application in both development and production environments.

## Files Included

- `Dockerfile` - For building the production image
- `Dockerfile.dev` - For development with hot reloading
- `docker-compose.yml` - Docker Compose configuration for production
- `docker-compose.dev.yml` - Docker Compose configuration for development
- `docker-start.sh` - Helper script for running Docker commands
- `nginx.conf` - Nginx configuration for the production environment
- `.dockerignore` - Files to exclude from Docker builds
- `.env.example` - Example environment variables file

## Running with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Using the helper script

We've included a helper script to make it easier to work with Docker:

```sh
# Make the script executable (only needed once)
chmod +x docker-start.sh

# Start in development mode (with hot reloading)
./docker-start.sh dev

# Start in production mode
./docker-start.sh prod

# Build the production Docker image
./docker-start.sh build

# Stop running containers
./docker-start.sh stop
```

### Manual Docker commands

If you prefer to use Docker commands directly:

#### Development mode

```sh
# Build and start the development container
docker-compose -f docker-compose.dev.yml up --build

# Stop the development container
docker-compose -f docker-compose.dev.yml down
```

#### Production mode

```sh
# Build and start the production container
docker-compose up --build

# Stop the production container
docker-compose down
```

### Environment Variables

Make sure to create a `.env` file with your environment variables before running the Docker containers. You can use the `.env.example` file as a template.
