var mysql = require('mysql');

// Loading configuration file with database credentials
var config = require('./config');
var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});

exports.insertSong = function(path, metadata) {
    console.log("Inserting metadata for song " + path);
    var title = metadata.title
        artist = metadata.artist
        album = metadata.album
        genre = metadata.genre[0]
        ;
    console.log(title + ", " + artist + ", " + album + ", " + genre)

    checkGenre(path, metadata);
}

var newlyRegisteredGenre = [];

function checkGenre(path, metadata) {
    var genre = metadata.genre[0];

    connection.query('SELECT count(*) FROM genres WHERE name = "' + genre + '"', function(err, rows, fields) {
        if (err) throw err;

        var nbMatch = parseInt(rows[0]["count(*)"]);
        if (nbMatch == 0) {
            // Checking if the genre was already told to be inserted by Mysql
            if (newlyRegisteredGenre.indexOf(genre) == -1 ) {
                console.log("Genre " + genre + " not existing, inserting...");
                newlyRegisteredGenre.push(genre);
                var genreInsertStatement = {id : '', name: genre};
                connection.query("INSERT INTO genres SET ?", genreInsertStatement, function(err, rows, fields) {
                    if (err) throw err;
                    console.log("Done");
                    checkArtist(path, metadata);
                });
            }
        }
        else {
            console.log("Genre already registered, moving on");
            checkArtist(path, metadata);
        }
    });
}

var newlyRegisteredArtist = [];

function checkArtist(path, metadata) {
    var artist = metadata.artist;

    connection.query('SELECT count(*) FROM artists WHERE name = "' + artist + '"', function(err, rows, fields) {
        if (err) throw err;

        var nbMatch = parseInt(rows[0]["count(*)"]);
        if (nbMatch == 0) {
            if (newlyRegisteredArtist.indexOf(artist) == -1 ) {
                console.log("Artist " + artist + " not existing, inserting...");
                newlyRegisteredArtist.push(artist);
                var artistInsertStatement = {id : '', name: artist};
                connection.query("INSERT INTO artists SET ?", artistInsertStatement, function(err, rows, fields) {
                    if (err) throw err;
                    console.log("Done");
                    checkAlbum(path, metadata);
                });
            }
        }
        else {
            console.log("Artist already registered, moving on");
            checkAlbum(path, metadata);
        }
    });
}

function checkAlbum(path, metadata) {
    console.log("Checking album");
}

/*
// Adding an artist
var artist = {id : '', name: 'Pink Martini'};
connection.query("INSERT INTO artists SET ?", artist, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding a genre
var genre = {id : '', name: 'Jazz'};
connection.query("INSERT INTO genres SET ?", genre, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding an album
var album = {id : '', name: 'Sympathique'};
connection.query("INSERT INTO albums SET ?", album, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding a song
var song = {id : '', name: 'Amado Mio', path: 'Pink Martini/Sympathique/Amado Mio.mp3', id_albums: 2, id_artists : 6};
connection.query("INSERT INTO songs SET ?", song, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding genre relation
var genreRelation = {id : 3, id_songs: 1};
connection.query("INSERT INTO genreAssociation SET ?", genreRelation, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// SELECT statement
connection.query("SELECT * FROM songs", function(err, rows, fields) {
    if (err) throw err;
    console.log('The result is: ', rows);
});
*/
