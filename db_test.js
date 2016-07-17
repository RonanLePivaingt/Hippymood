var mysql = require('mysql');

// Loading configuration file with database credentials
var config = require('./config');
var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});

connection.connect();

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
*/

// SELECT statement
connection.query("SELECT * FROM songs", function(err, rows, fields) {
    if (err) throw err;
    console.log('The result is: ', rows);
});

connection.end();
