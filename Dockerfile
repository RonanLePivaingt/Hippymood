FROM node:8.10

RUN mkdir /app
WORKDIR /app

RUN apt-get -qq update
RUN apt-get -qq install -y mysql-client apt-utils

COPY . .
RUN npm install
RUN npm install chalk

RUN npm run build
CMD [ "npm", "run", "prod" ]
