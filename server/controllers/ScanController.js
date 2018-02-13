var config = require('../../config/server.config');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);
var fs = require('fs');
var path = require('path');
var mm = require('musicmetadata');
var id3 = require('id3js');

exports.ScanMusic = function(req, res) {
  var async = require("async");

  // Initializing music scan queue
  var queue = async.queue(scan, 10); // Run ten simultaneous uploads
  var files = getFileList("music");
  queue.push(files);

  // Setting up an interval to check indexing progress
  var nbFiles = files.length;
  var percentage = 0;
  var newPercentage = 0;

  function percentageCheckedFiles () {
    var nbFilesLeft = queue.length();
    var percentageFilesLeft = nbFilesLeft / nbFiles;
    newPercentage = Math.round((1 - percentageFilesLeft) * 100);

    // Sending data to client and log if any progress is made
    if (percentage !== newPercentage) {
      percentage = newPercentage;
      req.io.emit('scan', percentage);
      console.log("Music scan progress : " + percentage + "%");
    }
  }
  var percentageInterval = setInterval(percentageCheckedFiles, 500);

  // Adding event on queue end processing
  queue.drain = function() {
    req.io.emit('scan', 'Done');

    console.log("All files are indexed");
    // Stoping previous interval
    clearInterval(percentageInterval);
  };

  // Sending a response back to client
  res.send("Music scan started");
};

// Function to get all files from a directory
function getFileList (directory) {
  // Getting all files of the music directory

  var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
      file = dir + '/' + file
      var stat = fs.statSync(file)
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file))
      }
      else if (file.split('.').pop() === 'mp3') {
        results.push({
          path: file,
          timestamp: Date.parse(stat.mtime)
        })
      }
    })
    return results;
  }
  return walk(directory);
}

function scan (fileInfo, callback) {
  // Prevent an undefined error when the queue is declared
  if (fileInfo === undefined)
    return false;

  if (config.videoScan)
    var checkVideo = true;
  else
    var checkVideo = false;

  var path = fileInfo.path;
  var timestamp = fileInfo.timestamp;

  // create a new parser from a node ReadStream
  var parser = mm(fs.createReadStream(path), function (err, metadata) {
    // if (err)
      // console.error(err);

    // Adding the file timestamp to metadata
    metadata['timestamp'] = timestamp;

    // Try to insert the song if a genre (mood) is set
    if (metadata.genre[0] && metadata.artist[0]) {
      if (checkVideo === false) {
        insertSong(path, metadata, callback);
      }
      else {
        id3({ file: path, type: id3.OPEN_LOCAL }, function(err, tags) {
          metadata['youtube'] = tags.v2['url-file'];
          insertSong(path, metadata, callback);
        });
      }
    }
    else {
      callback();
    }

  });
}

function insertSong (path, metadata, callback) {
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
            .insert({name: genre})
            .then(function(rows) {
              metadata['genre_id'] = rows[0];
              return checkArtist(path, metadata, callback);
            })
            .catch(function(err) {
              console.log("Error while inserting genre for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
              return callback();
            });
        }
      }
      else {
        metadata['genre_id'] = rows[0]['id'];
        return checkArtist(path, metadata, callback);
      }
    })
    .catch(function(err) {
      console.log(err);
      return callback();
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
            .insert({name: artist})
            .then(function(rows) {
              metadata['artist_id'] = rows[0];
              return checkAlbum(path, metadata, callback);
            })
            .catch(function(err) {
              console.log("Error while inserting artist for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
              console.log(err);
              return callback();
            });
        }
      }
      else {
        metadata['artist_id'] = rows[0]['id'];
        return checkAlbum(path, metadata, callback);
      }
    })
    .catch(function(err) {
      console.log(err);
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
            .insert({name: album})
            .then(function(rows) {
              metadata['album_id'] = rows[0];
              return checkSong(path, metadata, callback);
            })
            .catch(function(err) {
              console.log("Error while inserting album for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
              console.log(err);
              return callback();
            });
        }
      }
      else {
        metadata['album_id'] = rows[0]['id'];
        return checkSong(path, metadata, callback);
      }
    })
    .catch(function(error) {
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
  var timestamp = new Date(metadata.timestamp);

  return knex('songs')
    .insert({
        name: title,
        path: path,
        youtube: youtube,
        created_at: timestamp,
        id_albums: album_id,
        id_artists : artist_id
      })
    .then(function(rows) {
      metadata['song_id'] = rows[0];
      return genreRelation(metadata, callback);
    })
    .catch(function(err) {
      console.log("Error while inserting song : " + metadata.title + ", path : " + path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
      console.log(err);
      return callback();
    });
  /*
  return knex('songs')
    .where('path', path)
    .then(function(rows) {
      // Inserting if match
      nbMatch = rows.length;
      if (nbMatch == 0) {
      }
    })
    .catch(function(error) {
      return callback();
      throw error;
    });
    */

  // return true;
}

function genreRelation(metadata, callback) {
  genre_id = metadata.genre_id;
  song_id = metadata.song_id;

  knex('genres_relations')
    .insert({id : genre_id, id_songs: song_id})
    .then(function(rows) {
      console.log("Song successfully inserted for : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
      return callback();
    })
    .catch(function(err) {
      console.log("Error while associating genre to the song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
      console.log(err);
      return callback();
    });

  return true;
}
