FROM keymetrics/pm2:8-stretch

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
RUN npm install https://github.com/multi-cell/vue-trianglify#dev

CMD ["pm2-runtime", "ecosystem.config.js"]

EXPOSE 8080
