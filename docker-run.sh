
#!/bin/bash

# Check if .env file exists, if not create it from example
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example"
  cp .env.example .env
  echo "Please update .env file with your actual keys and credentials before proceeding"
  exit 1
fi

# Build and start the containers
docker-compose up --build

# Output some helpful info when exiting
trap 'echo "Containers stopped. To start again, run ./docker-run.sh"' EXIT
