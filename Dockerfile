FROM node:9

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm install

RUN apt-get -qq update
RUN apt-get -qq install -y mysql-client

# RUN npm run build
CMD [ "npm", "run", "dev" ]
