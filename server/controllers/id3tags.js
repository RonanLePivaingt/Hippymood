var fs = require('fs');
var mm = require('musicmetadata');
var db = require('./database');

exports.scan = function(path) {
    // create a new parser from a node ReadStream
    var parser = mm(fs.createReadStream(path), function (err, metadata) {
        if (err) 
            return false;

        // Try to insert the song if a genre (mood) is set
        if (metadata.genre[0]) {
            if (metadata.artist[0]) {
                db.insertSong(path, metadata);
            }
        }
        
    });
};
