var config = require('../config/server.config');
var dbConfig = require('../server/knex.js');
var knex = require('knex')(dbConfig);

var MPC = require('mpc-js').MPC;

var mpc = new MPC();

mpc.connectTCP('localhost', 6600);

/*
 * Function to get song infos by submitting a genre
 */
exports.PlayMood = function(moodName){
    var select = knex.select('songs.id', 'songs.name as song', 'artists.name AS artist', 'songs.path', 'albums.name AS album', 'songs.youtube', 'songs.created_at')
      .from('songs')
      .join('genres_relations', 'songs.id', '=', 'genres_relations.id_songs')
      .join('genres', 'genres_relations.id', '=', 'genres.id')
      .join('artists', 'artists.id', '=', 'songs.id_artists')
      .join('albums', 'albums.id', '=', 'songs.id_albums')
      .where('genres.name', moodName);
      // .whereNotIn('songs.id', songsIdAlreadyPlayed);

    select.then(function(rows) {
        if (rows.length > 0) {
	 console.log("Songs found for mood " + moodName);
	 mpc.currentPlaylist.clear();
	 for (var i in rows) {
   	   // console.log(rows[i].path.slice(6));
           mpc.currentPlaylist.add(rows[i].path.slice(6));
	 }
	 mpc.playbackOptions.setRandom(true);
	 mpc.playback.play();
        }
        else {
	 console.log("No song found for mood " + moodName);
        }
      })
      .catch(function(error) {
        console.error(error);
      });
};

exports.NextSong = function(){
    mpc.playback.next();
    console.log("Skipping this song");
};

require('make-runnable');
