var config = require('../../build/serverConfig');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

/*
 * Function to return the list of mood
 */
exports.Moods = function(req, res){
  var dbOptions = {
      host: config.db.host,
      port: config.db.port || 3306,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
      schema: {
          tableName: 'sessions',
          columnNames: {
              session_id: 'session_id',
              expires: 'expires',
              data: 'data'
          }
      }
  };
  var sessionStore = new MySQLStore(dbOptions);

  if (req.session.auth || config.auth.activate === 0) {
    knex.select('genres.id', 'genres.name')
      .count('songs.id as nbSongs')
      .count('songs.youtube as nbVideo')
      .from('genres')
      .join('genreAssociation', 'genres.id', '=', 'genreAssociation.id')
      .join('songs', 'songs.id', '=', 'genreAssociation.id_songs')
      .groupBy('genres.id')
      .then(function(rows) {
        res.send(
          shuffleArray(rows)
        );
      })
      .catch(function(error) {
        console.error(error);
      });
  } else {
    res.send("Must auth");
  }
}

/*
 * Function to get song infos by submitting a genre
 */
exports.Mood = function(req, res){
  if (req.session.auth || config.auth.activate === 0) {
    // Disabling cache for myurl.com/genre/id URLs to prevent some browser to play the same song again and again and again...
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    var moodId = req.body.moodId;
    var videoMode = req.body.videoMode;

    // Making an array of the already played songs
    var songsIdAlreadyPlayed = [];
    if (req.session.playedSongs && req.session.playedSongs.length != 0 && req.session.playedSongs != []) {
      req.session.playedSongs.forEach(function(songId) {
        songsIdAlreadyPlayed.push(songId);
      });
    }

    var select = knex.select('songs.id', 'songs.name as song', 'artists.name AS artist', 'songs.path', 'albums.name AS album', 'songs.youtube', 'songs.created_at')
      .from('songs')
      .join('genreAssociation', 'songs.id', '=', 'genreAssociation.id_songs')
      .join('artists', 'artists.id', '=', 'songs.id_artists')
      .join('albums', 'albums.id', '=', 'songs.id_albums')
      .where('genreAssociation.id', moodId)
      .whereNotIn('songs.id', songsIdAlreadyPlayed);

    if (videoMode) {
      select = select.whereNotNull('songs.youtube');
    }

    select.then(function(rows) {
        if (rows.length > 0) {
          var randomIndex1 = Math.floor(Math.random() * rows.length);

          var randomSongs = [];
          randomSongs.push(rows[randomIndex1]);

          // Selecting next song as well if possible
          if (rows.length > 1) {
            var randomIndex2 = randomIndex1;
            do {
              randomIndex2 = Math.floor(Math.random() * rows.length);
            } while (randomIndex1 == randomIndex2);
            randomSongs.push(rows[randomIndex2]);
          }

          // -1 to count the one being played
          var infos = {nbSongLeft: rows.length - 1};

          var randomIndex1 = Math.floor(Math.random() * rows.length);

          var randomSongs = [];
          randomSongs.push(rows[randomIndex1]);

          // Selecting next song as well if possible
          if (rows.length > 1) {
            var randomIndex2 = randomIndex1;
            do {
              randomIndex2 = Math.floor(Math.random() * rows.length);
            } while (randomIndex1 == randomIndex2);
            randomSongs.push(rows[randomIndex2]);
          }

          // -1 to count the one being played
          var infos = {nbSongLeft: rows.length - 1};

          // Resetting the list of played songs if the delay configured in config is passed
          if (req.session.lastVisit != undefined) {
            if(Date.now() - req.session.lastVisit > config.songList.timeSinceVisitReset) {
              req.session.playedSongs = undefined;
            }
          }
          req.session.lastVisit = Date.now();

          // Saving song played id
          if (req.session.playedSongs == undefined)
            req.session.playedSongs = [randomSongs[0]['id']];
          else
            req.session.playedSongs.push(randomSongs[0]['id']);

          // Creating response
          randomSongs.forEach(function(el, index, array) {
            el.moodId = moodId;
          });

          res.send({
            songs: randomSongs,
            nbSongsLeft: rows.length - 1
          });
        }
        else {
          var error = {"allSongGenrePlayed": 1};
          res.send({error});
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  }
};

/*
 * Function to get song infos by submitting a genre
 */
exports.Search = function(req, res){
  var keywords = '%' + req.params.keywords + '%';

  knex.select('songs.id', 'songs.name as song', 'artists.name AS artist', 'songs.path', 'albums.name AS album', 'genres.name as mood', 'genres.id as moodId')
    .from('songs')
    .join('genreAssociation', 'songs.id', '=', 'genreAssociation.id_songs')
    .join('genres', 'genres.id', '=', 'genreAssociation.id')
    .join('artists', 'artists.id', '=', 'songs.id_artists')
    .join('albums', 'albums.id', '=', 'songs.id_albums')
    .where('songs.name', 'like', keywords)
    .orWhere('artists.name', 'like', keywords)
    .orWhere('albums.name', 'like', keywords)
    .then(function(rows) {
      var data = {};
      if (rows.length > 0)
        data.searchResults = rows;
      res.send(data);
    })
    .catch(function(error) {
      console.error(error);
    });
};

/*
 * Function to get song infos by submitting a genre
 */
exports.newSongs = function(req, res){
  var page = req.params.page;

  var select = knex.select('songs.id', 'songs.name as song', 'artists.name AS artist', 'genres.id AS moodId', 'genres.name AS mood', 'songs.path', 'albums.name AS album', 'songs.youtube', 'songs.created_at')
    .from('songs')
    .join('genreAssociation', 'songs.id', '=', 'genreAssociation.id_songs')
    .join('genres', 'genreAssociation.id', '=', 'genres.id')
    .join('artists', 'artists.id', '=', 'songs.id_artists')
    .join('albums', 'albums.id', '=', 'songs.id_albums')
    .limit(10)
    .orderBy('songs.created_at', 'desc');

  if (page)
    select.offset(page * 10);

  select.then(function(rows) {
    var data = {};

    if (rows.length > 0)
      data.newSongs = rows;

    res.send(data);
  })
  .catch(function(err) {
    console.error(err);
  });
};

/*
 * If a song is played from the search result, this function will add it to the played songs list
 */
exports.searchSongPlayed = function(req, res){
  var songId = req.params.songId;

  // Saving song played id
  if (req.session.playedSongs == undefined) {
    req.session.playedSongs = [songId];
  }
  else {
    req.session.playedSongs.push(songId);
  }

  // Necessary to save the session (or req.session.save();) but cleaner because it gives a response to the client
  res.send("Done");
}

/*
 * Reset list of songs stored in sessions
 */
exports.ResetMood = function(req, res){
  var moodId = req.params.id;

  knex('genreAssociation')
    .where('id', moodId)
    .then(function(rows) {
      rows.forEach(function(entry, index) {
        var i = req.session.playedSongs.indexOf(entry.id_songs);
        req.session.playedSongs.splice(i, 1);
      });
      res.send("Mood ID : " + moodId);
    })
    .catch(function(error) {
      console.error(error);
    });
};

/*
 * Reset session
 */
exports.ResetSession = function(req, res){
  req.session.playedSongs = [];
  res.send("Done");
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

