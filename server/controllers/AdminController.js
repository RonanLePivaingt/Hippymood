var config = require('../../build/serverConfig');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

/*
 * Reset list of songs stored in sessions
 */
exports.ResetDatabase = function(req, res){
  // Could be cleaner with promises
  knex('genreAssociation').del().then(function () {
    knex('genres').del().then(function () {
      knex('songs').del().then(function () {
        knex('artists').del().then(function () {
          knex('albums').del().then(function () {
            res.send("Bim bim");
          });
        });
      });
    });
  });
};
