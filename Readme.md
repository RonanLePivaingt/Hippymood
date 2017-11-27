# Hippy Mood
Web app to play your music smoothly by genre/mood.

[Demo](http://hippymood.xyz)

# Build setup

## Install dependencies

``` bash
npm install
```

## Configuration
In the build directory, rename the serverConfig.js.example without the .example extension and set database credentials and others.

Create a music directory full of mp3s at the root of the hippymood directory.

## Development
Hot reloading of the UI when any change occur in src directory

``` bash
npm run dev
```

## Production
``` bash
# Generating compiled JS and CSS
npm run build

# Serving
npm run build
```

# Roadmap

## 0.5 (ongoing version)
- Migration of Vuejs from v1 to v2
- Use a query builder to prevent SQL injections (Knex.js)
- Clean up the architecture of the code
- Move to an architecture more friendly to Hippymood behavior change without touching to the core (with extensions, vuejs components maybe)

## 0.whoKnows
- Support multiple mood per song
- Define subgenres and adapt UI to browse them (electronic music is a good example)

## 0.whoKnows
- Search system
    - Play selected song, then the genre of the searched song

## 0.whoKnows
- New responsive UI

## 0.whoKnows
- Control the player with a mobile device and a QRcode (+url ?)
    - If available on the same network
    - Through the server (probably with a high latency)
