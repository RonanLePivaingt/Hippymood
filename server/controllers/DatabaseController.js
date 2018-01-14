var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

return Promise.all([
  knex.schema.createTableIfNotExists('albums', function(table) {
    table.increments('id').primary();
    table.string('name');
  }),
  knex.schema.createTableIfNotExists('artists', function(table) {
    table.increments('id').primary();
    table.string('name');
  }),
  knex.schema.createTableIfNotExists('genres', function(table) {
    table.increments('id').primary();
    table.string('name');
  }),
  knex.schema.createTableIfNotExists('songs', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.string('path');
    table.string('youtube');
    table.timestamps();
    table.integer('id_albums').unsigned();
    table.foreign('id_albums').references('albums.id');
    table.integer('id_artists').unsigned();
    table.foreign('id_artists').references('artists.id');
  }),
  knex.schema.createTableIfNotExists('genreAssociation', function(table) {
    table.primary(['id', 'id_songs']);
    table.integer('id').unsigned();
    // table.foreign('id').references('genres.id');
    table.integer('id_songs').unsigned();
    // table.foreign('id_songs').references('songs.id');
  })
]).then(() => {
  console.log('Database successfully initialized');
  process.exit(0);
}).catch(reason => {
  console.log(reason)
  process.exit(1);
});

