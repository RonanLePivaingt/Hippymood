var config = require('../../build/serverConfig');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

// Registering session as authentified
exports.Unlock = function(req, res){
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
  if (req.body.combination == config.auth.combinationCode) {
    req.session.auth = 1;
    res.send("OK");
  }
};
