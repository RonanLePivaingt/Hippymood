# Hippymood

## Installation with Docker

### Development setup
Create your own docker-compose.override.yaml file from docker-compose.override.yaml.dist

Inside the config directory, create your own development.json file from development.json.dist file

```
# Install dependencies

docker-compose run --rm backend yarn install
docker-compose run --rm frontend yarn install

# Initiate DB and scan music files

docker-compose run --rm backend yarn dbInit
docker-compose run --rm backend yarn scan

# Project is now ready for startup
docker-compose up
```

### Production setup

Create your own docker-compose.override.yaml file from docker-compose.override.yaml.dist

Inside the config directory, create your own production.json file from production.json.dist file

```
# Build frontend files

docker-compose run --rm frontend yarn build

# Initiate DB and scan music files

docker-compose run --rm backend yarn dbInit
docker-compose run --rm backend yarn scan

# Project is now ready for startup
docker-compose up
```
