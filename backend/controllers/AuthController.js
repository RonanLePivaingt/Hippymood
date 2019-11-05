const config = require('config');
const dbConfig = require('../dbConfig.js');
const knex = require('knex')(dbConfig);

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
