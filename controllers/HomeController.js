var mysql = require('mysql');

// Loading configuration file with database credentials
var config = require('./../config');
var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});

exports.Index = function(req, res){
    connection.query('SELECT * FROM genres', function(err, rows, fields) {
        res.render('index', { title: 'Hippymood', genres: rows});
    });
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
    if (req.session.playedSongs) {
        SQLquery += 'AND songs.id NOT IN (';
        req.session.playedSongs.forEach(function(entry, index) {
            if (index != req.session.playedSongs.length -1)
                SQLquery += '"' + entry + '", ';
            else
                SQLquery += '"' + entry + '") ';

        });
    }

    connection.query(SQLquery, function(err, rows, fields) {
        if (rows.length > 0) {
            //console.log(rows);
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
