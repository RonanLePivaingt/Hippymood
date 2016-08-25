var mysql = require('mysql');

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

// Loading configuration file with database credentials
var config = require('./../config');
var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database,
    multipleStatements: true
});

exports.Index = function(req, res){
    res.render('index');
};
exports.App = function(req, res){
    var SQLquery = 'SELECT genres.id, genres.name, COUNT(songs.id) AS nbSongs ';
        SQLquery += 'FROM songs ';
        SQLquery += 'JOIN genreAssociation ON songs.id = genreAssociation.id_songs ';
        SQLquery += 'JOIN genres ON genreAssociation.id = genres.id ';
        SQLquery += 'GROUP BY genres.id ';
        SQLquery += 'ORDER BY nbSongs DESC ';

    connection.query(SQLquery, function(err, rows, fields) {
        if (err)
            console.log(err);
        else {
            var topGenre = [];
            for (var o = 0; o < config.nbTopGenre; o++) {
                topGenre.push(rows.shift());
            }
            var randomRows = topGenre.concat(shuffleArray(rows));
            console.log(randomRows);
            res.render('app', {genres: randomRows});
        }
    });
};
exports.Admin = function(req, res){
    res.render('admin');
};

// Function to get song infos by submitting a genre
exports.Genre = function(req, res){
    var genre = req.params.id;

    var SQLquery = 'SELECT songs.id, songs.name AS song, artists.name AS artist, songs.path, albums.name AS album ';
        SQLquery += 'FROM songs, genreAssociation, artists, albums ';
        SQLquery += 'WHERE songs.id = genreAssociation.id_songs ';
        SQLquery += 'AND genreAssociation.id = "' + req.params.id + '"';
        SQLquery += 'AND songs.id_artists = artists.id ';
        SQLquery += 'AND songs.id_albums = albums.id ';

    // Select song from not played songs
    if (req.session.playedSongs && req.session.playedSongs.length != 0 && req.session.playedSongs != []) {
        SQLquery += 'AND songs.id NOT IN (';
        req.session.playedSongs.forEach(function(entry, index) {
            if (index != req.session.playedSongs.length -1)
                SQLquery += '"' + entry + '", ';
            else
                SQLquery += '"' + entry + '") ';

        });
    }

    connection.query(SQLquery, function(err, rows, fields) {
        if (err) throw err;

        if (rows.length > 0) {
            var randomSong = rows[Math.floor(Math.random() * rows.length)];

            // Saving song played id
            if (req.session.playedSongs == undefined) 
                req.session.playedSongs = [randomSong['id']];
            else 
                req.session.playedSongs.push(randomSong['id']);

            res.send({randomSong});
        }
        else {
            var error = {"allSongGenrePlayed": 1};
            res.send({error});
        }
    });
};

// Reset list of songs stored in sessions
exports.ResetGenre = function(req, res){
    var genreId = req.params.id;
    console.log("Reseting session stored played songs for genre " + genreId);
    connection.query('SELECT * FROM genreAssociation WHERE id = ' + genreId, function(err, rows, fields) {
        rows.forEach(function(entry, index) {
            var i = req.session.playedSongs.indexOf(entry.id_songs);
            req.session.playedSongs.splice(i, 1);
        });
        res.send("Genre ID : " + genreId);
    });
};

// Reset sessions
exports.ResetSessions = function(req, res){
    req.session.playedSongs = [];
    res.send("Done");
};

// Reset list of songs stored in sessions
exports.ResetDatabase = function(req, res){
    connection.query("DELETE FROM genreAssociation; DELETE FROM genres; DELETE FROM songs; DELETE FROM artists; DELETE FROM albums; DELETE FROM sessions;", function(err, results) {
        res.send("Bim bim");
    });
};

exports.ScanMusic = function(req, res){

    // Loading tags processing
    var id3tags = require('../id3tags');

    var fs = require('fs');
    var path = require('path');

    var walk = function(dir) {
        var results = []
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()) results = results.concat(walk(file))
            else results.push(file)
        })
        return results
    }
    var files = walk("music");
    // loop through array with all new ids
    var i = 0, l = files.length;
    console.log("Starting music scan");
    (function iterator() {
        var filename = files[i];
        if (filename.slice(-3) == "mp3") {
            id3tags.scan(filename);
        }

        if(++i<l) {
            setTimeout(iterator, 50);
        }
        else {
            console.log("Music scan done");
            res.send("Done");
        }
    })();
};
