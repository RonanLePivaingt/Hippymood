var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

/*
 * Function to create the full database
 */
exports.Up = function(req, res){
  Promise.all([
    knex.schema.createTableIfNotExists('albums', function(t) {
      t.increments('id').primary();
      t.string('name');
    }),
    knex.schema.createTableIfNotExists('artists', function(t) {
      t.increments('id').primary();
      t.string('name');
    }),
    knex.schema.createTableIfNotExists('genres', function(t) {
      t.increments('id').primary();
      t.string('name');
    }),
    knex.schema.createTableIfNotExists('songs', function(t) {
      t.increments('id').primary();
      t.string('name');
      t.string('path');
      t.string('youtube');
      t.timestamps();
      t.integer('id_albums').unsigned();
      t.foreign('id_albums').references('albums.id');
      t.integer('id_artists').unsigned();
      t.foreign('id_artists').references('artists.id');
    }),
    knex.schema.createTableIfNotExists('genres_relations', function(t) {
      t.integer('id').unsigned();
      t.foreign('id').references('genres.id');
      t.integer('id_songs').unsigned();
      t.foreign('id_songs').references('songs.id');
    }),
    knex.schema.createTableIfNotExists('users', function(t) {
      t.increments('id').primary();
      t.string('name');
    }),
    knex.schema.createTableIfNotExists('suggestions', function(t) {
      t.increments('id').primary();
      t.string('title');
      t.string('file');
      t.string('file_originalname');
      t.string('url');
      t.string('song_path');
      t.string('status');
      t.timestamps(true, knex.fn.now());
      t.integer('id_user').unsigned();
      t.foreign('id_user').references('users.id');
    }),
    knex.schema.createTableIfNotExists('suggestions_messages', function(t) {
      t.increments('id').primary();
      t.string('content');
      t.string('song_name');
      t.string('artist');
      t.string('album');
      t.json('suggestion_moods');
      t.boolean('video');
      t.timestamps(true, knex.fn.now());
      t.integer('id_user').unsigned();
      t.foreign('id_user').references('users.id');
      t.integer('id_suggestion').unsigned();
      t.foreign('id_suggestion').references('suggestions.id');
    })
  ])
  .then(function() {
    console.log("Databse successfully initialized");
    // Process successfully exiting
    process.exit();
  })
  .catch(function(error) {
    console.log("Shit it the fan !");
    console.log(error);
    process.exit(1);
  })
  ;
}

/*
 * Function to delete the music database except users and suggestions
 */
exports.Down = function(req, res){
  if (req.session.masterUser === true) {
    // Could be cleaner with promises
    knex('genres_relations').del().then(function () {
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
  } else {
    res.send("Not your business");
  }
}

require('make-runnable');
