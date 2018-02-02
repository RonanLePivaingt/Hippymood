var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

// Database creation
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
    t.string('url');
    t.boolean('video');
    t.string('song_path');
    t.string('status');
    t.timestamps();
    t.integer('id_user').unsigned();
    t.foreign('id_user').references('users.id');
  }),
  knex.schema.createTableIfNotExists('messages', function(t) {
    t.increments('id').primary();
    t.string('content');
    t.json('suggestionMoods');
    t.timestamps();
    t.integer('id_user').unsigned();
    t.foreign('id_user').references('users.id');
    t.integer('id_suggestion').unsigned();
    t.foreign('id_suggestion').references('suggestions.id');
  })
  /*
  Storyboard of suggestion exchange :
  - A user login, is redirected to the list of suggestion made and can ad one (record unfinished suggestion ? => offline with local storage for privacy reasons)
  (Master user receive a push notification and have a notification displayed)
  - Master user can write a message to clarify the suggestion and validate some exchange
  - User see a message next time it does login (remember user in localstorage ? Propose to send a mail notification)
  - When exchanges are set, the master user manually add the song, possibly give a link to the song and set status as added ;)
  */
]);
