#!/bin/bash
# The frontend build system is dependant on the server.config.js file
# This bash script make sure the build was generated with the current config file

if [[ $1 == perf ]]; then
  echo "Resetting DB before peformance test..."
  npm run dbReset
  # ./node_modules/.bin/clinic doctor --collect-only -- npm run scanMusic cli
  # ./node_modules/.bin/clinic bubbleprof --collect-only -- npm run scanMusic cli
  echo "Scanning Hippymood library with $2 performance tool..."
  ./node_modules/.bin/clinic $2 --collect-only -- node server/controllers/ScanController.js ScanMusic cli
elif [[ $1 == dev ]]; then
  echo "Serving Hippymmod with hot reloading (dev)"
  npm run dev
else
  current_config_hash=`md5sum /app/config/server.config.js | awk '{print $1}'`
  build_config_hash=`cat docker/build_config_hash | awk '{print $1}'`

  if [ "$current_config_hash" != "$build_config_hash" ]; then
    # Building Hippymood according to the last server configuration
    echo "Building Hippymood with the news server config..."
    npm run build
    md5sum config/server.config.js > docker/build_config_hash
  fi

  echo "Serving Hippymood..."
  npm run prod
fi
