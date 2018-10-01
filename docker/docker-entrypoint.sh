#!/bin/bash
# The frontend build system is dependant on the server.config.js file
# This bash script make sure the build was generated with the current config file

if [[ $1 == dev ]]; then
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
