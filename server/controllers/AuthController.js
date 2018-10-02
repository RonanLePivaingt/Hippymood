var config = require('../../config');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

// Server side authentification validation
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

  // Check the combination sent by client or grant access directly if in demo mode
  if (req.body.combination == config.auth.combinationCode || config.demoMode === 1) {
    // Associating current session with successful authentification
    req.session.auth = 1;

    // Sending response to client
    res.send({
      success: true
    });
  } else {
    // Sending response to client
    res.send({
      success: false
    });
  }
};

// Login and eventual user creation
exports.Login = function(req, res){
  var user = req.body.seed;

  knex.select('*')
    .from('users')
    .where({name: user})
    .then(function(rows) {
      // Checking if a new user was found
      if (rows[0]) {
        // Creating the object that will be returned to client
        return new Promise((resolve, reject) => {
          resolve({
            id: rows[0].id,
            name: user,
            status: 'Found'
          });
        });
      } else {
        // Inserting new user in database & creating the object that will be returned to client
        return knex.
          insert({name: user}, 'id')
          .into('users')
          .then(function(id) {
            return new Promise((resolve, reject) => {
              resolve({
                id: id[0],
                name: user,
                status: 'Created'
              });
            });
          })
        ;
      }
    })
    .then(function(result) {
      // Associating current session with user ID
      req.session.userId = result.id;

      // Telling to client if it's the master user
      if (result.name === config.admin.masterUser) {
        req.session.masterUser = true;
        result.masterUser = true;
      } else {
        req.session.masterUser = false;
        result.masterUser = false;
      }

      // Sending result to client
      res.send(result);
    })
    .catch(function(error) {
      console.error(error);
      res.send({
        error: true
      });
    });
};
