var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

return Promise.all([
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
  knex.schema.createTableIfNotExists('genreAssociation', function(t) {
    t.primary(['id', 'id_songs']);
    t.integer('id');
    t.foreign('id').references('genres.id');
    t.integer('id_songs');
    t.foreign('id_songs').references('songs.id');
  }),
  knex.schema.createTableIfNotExists('users', function(t) {
    t.increments('id').primary();
    t.string('name');
  })
]);
