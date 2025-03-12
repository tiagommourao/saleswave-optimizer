
#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "No .env file found. Creating from example..."
  cp .env.example .env
  echo "Please update the .env file with your actual credentials."
  exit 1
fi

# Build and start the containers
docker-compose up -d

echo "Application started! Access it at http://localhost"
