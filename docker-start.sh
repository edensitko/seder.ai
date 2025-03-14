#!/bin/bash

# Make script executable with: chmod +x docker-start.sh

# Function to display help message
show_help() {
    echo "Usage: ./docker-start.sh [option]"
    echo "Options:"
    echo "  dev       Start the application in development mode"
    echo "  prod      Start the application in production mode"
    echo "  build     Build the Docker image for production"
    echo "  stop      Stop running containers"
    echo "  help      Display this help message"
}

# Check if an argument was provided
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Process the argument
case "$1" in
    dev)
        echo "Starting application in development mode..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    prod)
        echo "Starting application in production mode..."
        docker-compose up --build
        ;;
    build)
        echo "Building production Docker image..."
        docker build -t seder-ai:latest .
        ;;
    stop)
        echo "Stopping running containers..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        ;;
    help)
        show_help
        ;;
    *)
        echo "Invalid option: $1"
        show_help
        exit 1
        ;;
esac
