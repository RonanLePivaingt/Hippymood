# Hippy Mood
Web app to play your music smoothly by genre/mood.

[Demo](http://hippymood.3615yeye.info)

Demo disclaimer :
- Not responsive yet
- Only the Youtube based video mode will play music, not direct mp3 playing for legal reasons

## Docker

### Configuration
In the config directory, rename the server.config.js.example without the .example extension and don't forget to match the database credentials in docker-compose.yml.

### Development
``` bash
docker-compose -f docker-compose.dev.yml up
```

### Production
``` bash
docker-compose up
```

## Usage

### Configuration
In the config directory, rename the server.config.js.example without the .example extension and set database credentials and others.

### Build Setup

#### Install dependencies

``` bash
npm install
```

#### Development
Hot reloading of the UI when any change occur in src directory

``` bash
npm run dev
```

#### Production
``` bash
# Generating compiled JS and CSS
npm run build

# Serving
npm run prod
```

## Roadmap

### 0.5
- Migration of Vuejs from v1 to v2
- Use a query builder to prevent SQL injections (Knex.js)
- Clean up the architecture of the code
- Provide usage with Docker
- Support user suggestion
- ~~Move to an architecture more friendly to Hippymood behavior change without touching to the core (with extensions, vuejs components maybe)~~

### 0.whoKnows
- New responsive UI

### 0.whoKnows
- Support multiple mood per song
- Define subgenres and adapt UI to browse them (electronic music is a good example)

### 0.whoKnows
- Control the player with a mobile device and a QRcode (+url ?)
    - If available on the same network
    - Through the server (probably with a high latency)
