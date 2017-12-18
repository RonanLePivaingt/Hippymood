var config = require('../../build/serverConfig');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

// Registering session as authentified
exports.Unlock = function(req, res){
  if (req.body.combination == config.auth.combinationCode) {
    req.session.auth = 1;
    res.send("OK");
  }
};
