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

    connection.query(SQLquery, function(err, rows, fields) {
        var randomSong = rows[Math.floor(Math.random() * rows.length)];
        randomSong['path'] = randomSong['path'].substring(21); // 21 pour JLC et 25 en local

        res.send({randomSong});
    });
};
