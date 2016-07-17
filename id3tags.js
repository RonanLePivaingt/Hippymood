var fs = require('fs');
var mm = require('musicmetadata');
var db = require('./database');

exports.scan = function(path) {
    // create a new parser from a node ReadStream
    var parser = mm(fs.createReadStream(path), function (err, metadata) {
        if (err) throw err;
        var songMetadata = "Title : " + metadata.title + ", ";
        songMetadata += "Artist : " + metadata.artist[0] + ", ";
        songMetadata += "Album : " + metadata.album + ", ";
        songMetadata += "Genre : " + metadata.genre[0];

        // TO DO : properly check the title, artist, album and genre before inserting
        if (metadata.genre[0] != "")
            db.insertSong(path, metadata);
    });
};
