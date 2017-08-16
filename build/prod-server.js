var config = require('./serverConfig.js');
var express = require('express');
var app = express();

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = require('./serverConfig');
var dbOptions = {
    host: config.db.host,
    port: config.db.port || 3306,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};
var sessionStore = new MySQLStore(dbOptions);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
    })
);

require('../server/router')(app);

app.use(express.static('dist'));
app.use('/music', express.static('music'));

app.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port);
});
