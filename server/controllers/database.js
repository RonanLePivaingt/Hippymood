// Loading configuration file with database credentials
var config = require('../../build/serverConfig');
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  }
});

exports.insertSong = function(path, metadata, callback) {
    var title = metadata.title
        artist = metadata.artist
        album = metadata.album
        genre = metadata.genre[0]
        ;

    checkGenre(path, metadata, callback);
}

var newlyRegisteredGenre = [];

function checkGenre(path, metadata, callback) {
  var genre = metadata.genre[0];

  knex('genres')
    .where('name', genre)
    .then(function(rows) {       
      var nbMatch = rows.length;
      if (nbMatch == 0) {
        // Checking if the genre was already told to be inserted by Mysql
        if (newlyRegisteredGenre.indexOf(genre) == -1 ) {
          newlyRegisteredGenre.push(genre);
          knex('genres')
            .insert({id : '', name: genre})
            .then(function(rows) {
              metadata['genre_id'] = rows[0];
              return checkArtist(path, metadata, callback);
            })
            .catch(function(err) {
              console.log("Error while inserting genre for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
              callback();
              throw err;
            });
        }
      }
      else {
        metadata['genre_id'] = rows[0]['id'];
        return checkArtist(path, metadata, callback);
      }
    })
    .catch(function(error) {
      return callback();
      throw error;
    });
  return true;
}

var newlyRegisteredArtist = [];

function checkArtist(path, metadata, callback) {
  var artist = metadata.artist;

  knex('artists')
    .where('name', artist)
    .then(function(rows) {       
      var nbMatch = rows.length;
      if (nbMatch == 0) {
        if (newlyRegisteredArtist.indexOf(artist) == -1 ) {
          newlyRegisteredArtist.push(artist);

          knex('artists')
            .insert({id : '', name: artist})
            .then(function(rows) {
              metadata['artist_id'] = rows[0];
              return checkAlbum(path, metadata, callback);
            })
            .catch(function(err) {
              console.log("Error while inserting artist for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
              return callback();
              throw err;
            });
        }
      }
      else {
        metadata['artist_id'] = rows[0]['id'];
        return checkAlbum(path, metadata, callback);
      }
    })
    .catch(function(error) {
      throw error;
      return callback();
    });

  return true;
}

var newlyRegisteredAlbum = [];

function checkAlbum(path, metadata, callback) {
  var album = metadata.album;

  knex('albums')
    .where('name', album)
    .then(function(rows) {       
      nbMatch = rows.length;
      if (nbMatch == 0) {
        if (newlyRegisteredAlbum.indexOf(album) == -1 ) {
          newlyRegisteredAlbum.push(album);

          knex('albums')
            .insert({id : '', name: album})
            .then(function(rows) {
              metadata['album_id'] = rows[0];
              return checkSong(path, metadata, callback);
            })
            .catch(function(err) {
              console.log("Error while inserting album for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
              return callback();
              throw err;
            });
        }
      }
      else {
        metadata['album_id'] = rows[0]['id'];
        return checkSong(path, metadata, callback);
      }
    })
    .catch(function(error) {
      throw error;
      return callback();
    });

  return true;
}

function checkSong(path, metadata, callback) {
  var genre = metadata.genre[0];
  var genre_id = metadata.genre_id;
  var artist = metadata.artist;
  var artist_id = metadata.artist_id;
  var album = metadata.album;
  var album_id = metadata.album_id;
  var title = metadata.title;
  var youtube = metadata.youtube;
  var timestamp = metadata.timestamp;

  knex('songs')
    .where('path', path)
    .then(function(rows) {       
      // Inserting if match
      nbMatch = rows.length;
      if (nbMatch == 0) {
        knex('songs')
          .insert({
              id : '',
              name: title,
              path: path,
              youtube: youtube,
              timestamp: timestamp,
              id_albums: album_id,
              id_artists : artist_id
            })
          .then(function(rows) {
            metadata['song_id'] = rows[0];
            return genreAssociation(metadata, callback);
          })
          .catch(function(err) {
            console.log("Error while inserting song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
            return callback();
            throw err;
          });
      }
    })
    .catch(function(error) {
      return callback();
      throw error;
    });

  return true;
}

function genreAssociation(metadata, callback) {
  genre_id = metadata.genre_id;
  song_id = metadata.song_id;

  knex('genreAssociation')
    .insert({id : genre_id, id_songs: song_id})
    .then(function(rows) {
      console.log("Song successfully inserted for : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
      console.log(metadata.timestamp);
      return callback();
    })
    .catch(function(err) {
      console.log("Error while associating genre to the song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
      return callback();
      throw err;
    });

  return true;
}
