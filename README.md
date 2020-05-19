# Hippymood

Web app to play your music smoothly by genre/mood.

[Demo](http://hippymood.3615yeye.info)

Demo disclaimer :
- Only the Youtube based video mode will play music, not direct mp3 playing for legal reasons

## Installation with Docker

### Development setup
Create your own docker-compose.override.yaml file from docker-compose.override.yaml.dist

Inside the config directory, create your own development.json file from development.json.dist file

```
# Install dependencies

docker-compose run --rm backend npm install
docker-compose run --rm frontend npm install

# Initiate DB and scan music files

docker-compose run --rm backend npm run dbInit
docker-compose run --rm backend npm run scan

# Project is now ready for startup

docker-compose up
```

### Production setup

Create your own docker-compose.override.yaml file from docker-compose.override.yaml.dist

Inside the config directory, create your own production.json file from production.json.dist file

```
# Install dependencies

docker-compose run --rm backend npm install
docker-compose run --rm frontend npm install

# Build frontend files

docker-compose run --rm frontend npm build

# Initiate DB and scan music files

docker-compose run --rm backend npm run dbInit
docker-compose run --rm backend npm run scan

# Project is now ready for startup

docker-compose up
```
