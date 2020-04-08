var express = require('express');
const app = express();

var cors = require('cors');
app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const config = require('config');
const dbConfig = require('./dbConfig.js');
const knex = require('knex')(dbConfig);
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions' // optional. Defaults to 'sessions'
});

app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 7890000000 // Cookie expiration set to 3 month
  },
  store: store,
  saveUninitialized: true,
  resave: false,
}));

app.use(express.static('dist'));

// Disabling mp3 serve in demo mode
if (config.get('global.demoMode') === false)
  app.use('/music', express.static(config.get('music.path')));

app.use('/tmp', express.static('tmp'));

// Adding a delay to AJAX responses (for development purpose)
if (Number.isInteger(config.get('dev.ajaxDelay')) && config.get('dev.ajaxDelay') > 0) {
  app.use(function(req,res,next) {
    setTimeout(next, config.get('dev.ajaxDelay'));
  });
}

var http = require('http');
var server = http.createServer(app);

require('./router')(app);

server.listen(config.get('backend.port'), function () {
  console.log('Example app listening on port ' + config.get('backend.port'));
});
