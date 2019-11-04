FROM node:12-stretch

RUN mkdir /app
WORKDIR /app

RUN apt-get -qq update
RUN apt-get -qq install -y mysql-client apt-utils

COPY . .

# Copying the example config file to get the automatic build on Dockerhub working
COPY config/server.config.js.example config/server.config.js

RUN npm install
RUN npm install https://github.com/multi-cell/vue-trianglify#dev

RUN npm run build && md5sum config/server.config.js > docker/build_config_hash

ENTRYPOINT ["/app/docker/docker-entrypoint.sh"]

CMD [ "npm", "run", "prod" ]

EXPOSE 80
