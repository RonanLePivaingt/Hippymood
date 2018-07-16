var config = require('../config/server.config.js');
var express = require('express');
var app = express();
var cors = require('cors')

// Enable all CORS request to get POST data working
app.use(cors())

var session = require('express-session');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const KnexSessionStore = require('connect-session-knex')(session);
const Knex = require('knex');

var config = require('../config/server.config.js');
const knex = Knex({
    client: 'mysql',
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    }
});

const store = new KnexSessionStore({
    knex: knex,
    tablename: 'sessions' // optional. Defaults to 'sessions'
});

app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 7890000000 // Cookie expiration set to 3 month
    },
    store: store
}));
app.use(express.static('dist'));
app.use('/music', express.static('music'));
app.use('/tmp', express.static('tmp'));

var io = require('socket.io');
var http = require('http');
var server = http.createServer(app);
io = io(server);
app.use(function(req, res, next) {
  req.io = io;
  next();
});

io.on('connection', function(socket) {
  console.log('socket.io connection made');
});

require('../server/router')(app);

server.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port);
});
