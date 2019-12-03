FROM node:12-stretch AS build-env

RUN mkdir -p /app/frontend

COPY . /app/

WORKDIR /app/frontend

RUN yarn global add @vue/cli @vue/cli-service
RUN yarn install

EXPOSE 8080

CMD ['yarn', 'build']
