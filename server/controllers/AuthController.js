var config = require('../../config/server.config');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

// Registering session as authentified
exports.Unlock = function(req, res){
  if (req.body.combination == config.auth.combinationCode) {
    req.session.auth = 1;
    res.send("OK");
  }
};

// Login and seed creation
exports.Login = function(req, res){
  console.log(req.body);
  // Check if the seed name already exist
  // If exist associate the seed to the session
  // If it doesn't create the user and the associate it to the session
};
