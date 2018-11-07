var express = require('express');
var app = express();
var config = require('config');

var cors = require('cors');
app.use(cors());

app.set('trust proxy', 1)

const session = require('express-session');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const KnexSessionStore = require('connect-session-knex')(session);
const Knex = require('knex');

const knex = Knex({
  client: 'mysql',
  connection: config.get('db')
});

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions' // optional. Defaults to 'sessions'
});

app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 7890000000, // Cookie expiration set to 3 month
    secure: false
  },
  proxy: true,
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(express.static('dist'));

// Disabling mp3 serve in demo mode
if (config.get('demoMode') !== 1)
  app.use('/music', express.static('music'));

app.use('/tmp', express.static('tmp'));

var http = require('http');
var server = http.createServer(app);

require('./router')(app);

server.listen(config.get('backendPort'), function () {
  console.log('Example app listening on port ' + config.get('backendPort'));
});
