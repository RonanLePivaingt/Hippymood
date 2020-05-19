FROM node:12-stretch AS build-env

RUN mkdir -p /app/frontend

COPY . /app/

WORKDIR /app/frontend

RUN npm install -g @vue/cli @vue/cli-service
RUN npm install

EXPOSE 8080

CMD ['npm', 'run', 'build']
