FROM node:9

COPY package.json package.json
RUN npm install
COPY . .
COPY .eslintrc.js .eslintrc.js
COPY .eslintignore .eslintignore

RUN apt-get -qq update
RUN apt-get -qq install -y mysql-client

CMD ["npm","run", "dev"]
