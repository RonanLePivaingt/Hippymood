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
        res.render('index', { title: 'Hippymood', message: 'HippyMood', genres: rows});
    });
};

// Function to get song infos by submitting a genre
exports.Genre = function(req, res){
    var genre = req.params.id;

    var SQLquery = 'SELECT * FROM songs, genreAssociation WHERE songs.id = genreAssociation.id_songs AND genreAssociation.id = "' + req.params.id + '"';

    connection.query(SQLquery, function(err, rows, fields) {
        var randomSong = rows[Math.floor(Math.random() * rows.length)];
        randomSong['path'] = randomSong['path'].substring(25);

        res.send({ title: 'Hippymood', message: 'HippyMood', randomSong: randomSong});
    });
};
