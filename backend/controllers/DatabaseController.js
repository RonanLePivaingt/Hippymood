const dbConfig = require('../dbConfig.js');
const knex = require('knex')(dbConfig);

/*
 * Function to create the full database
 */
module.exports.Up = () => {
  Promise.all([
    knex.schema.hasTable('albums').then(exists => {
      if (!exists) {
        return knex.schema.createTable('albums', t => {
          t.increments('id').primary();
          t.string('name');
          t.index('name');
        });
      }

      return 'Table exist';
    }),
    knex.schema.hasTable('artists').then(exists => {
      if (!exists) {
        return knex.schema.createTable('artists', t => {
          t.increments('id').primary();
          t.string('name');
          t.index('name');
        });
      }

      return 'Table exist';
    }),
    knex.schema.hasTable('users').then(exists => {
      if (!exists) {
        return knex.schema.createTable('users', t => {
          t.increments('id').primary();
          t.string('name');
        });
      }

      return 'Table exist';
    }),
  ]).then( () =>  {
    Promise.all([
      knex.schema.hasTable('songs').then(exists => {
        if (!exists) {
          return knex.schema.createTable('songs', t => {
            t.increments('id').primary();
            t.string('name');
            t.string('path');
            t.string('youtube');
            t.timestamps();
            t.integer('id_album').unsigned();
            t.foreign('id_album').references('albums.id');
            t.integer('id_artist').unsigned();
            t.foreign('id_artist').references('artists.id');
            t.index('name');
          });
        }

        return 'Table exist';
      }),
    ]).then( () => {
      Promise.all([
        knex.schema.hasTable('genres').then( exists =>{
          if (!exists) {
            return knex.schema.createTable('genres', t => {
              t.increments('id').primary();
              t.string('name');
              t.index('name');
            }).then((res) => {
              knex.schema.hasTable('genres_relations').then(exists => {
                if (!exists) {
                  return knex.schema.createTable('genres_relations', t => {
                    t.integer('id').unsigned();
                    t.foreign('id').references('genres.id');
                    t.integer('id_song').unsigned();
                    t.foreign('id_song').references('songs.id');
                  });
                }

                return 'Table exist';
              })
            });
          }

          return 'Table exist';
        }),
        knex.schema.hasTable('suggestions').then(exists => {
          if (!exists) {
            return knex.schema.createTable('suggestions', t => {
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
            });
          }

          return 'Table exist';
        }),
        knex.schema.hasTable('suggestions').then(exists => {
          if (!exists) {
            return knex.schema.createTable('suggestions_messages', t => {
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
            });
          }

          return 'Table exist';
        })
      ])
        .then(res => {
          console.log("Database is up");
          process.exit();
        });
    });
  });
}

/*
 * Function to delete the music database except users and suggestions
 */
exports.Down = (req, res) => {
  // Could be cleaner
  knex('genres_relations').del().then(() => {
    knex('genres').del().then(() => {
      knex('songs').del().then(() => {
        knex('artists').del().then(() => {
          knex('albums').del().then(() => {
            // res.send("Bim bim");
            console.log("All music in the database is now gone");
            process.exit();
          });
        });
      });
    });
  });
}

require('make-runnable/custom')({
  printOutputFrame: false
});
