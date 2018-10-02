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
# Front end
npm run serve

# Back-end
node server/server.js
```

#### Production
``` bash
# Generating compiled JS and CSS
npm run build

# Serving front-end
npm run prod

# Back-end
node server/server.js
```

## Roadmap

### 0.5.1
- New responsive UI

### 0.whoKnows
- Support multiple mood per song
- Define subgenres and adapt UI to browse them (electronic music is a good example)

### 0.whoKnows
- Control the player with a mobile device and a QRcode (+url ?)
    - If available on the same network
    - Through the server (probably with a high latency)
