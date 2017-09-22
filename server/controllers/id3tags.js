var fs = require('fs');
var mm = require('musicmetadata');
var db = require('./database');
// Other id3 tags reader library to get the url-file attribute where could be stored the youtube URL
var id3 = require('id3js');

exports.scan = function(path, callback, checkVideo = false) {
  // Not checking videos
  checkVideo = true;

  // create a new parser from a node ReadStream
  var parser = mm(fs.createReadStream(path), function (err, metadata) {
    // if (err)
      // console.error(err);

    // Try to insert the song if a genre (mood) is set
    if (metadata.genre[0] && metadata.artist[0]) {
      if (checkVideo === false) {
        db.insertSong(path, metadata, callback);
      }
      else {
        // throw "monException"; // génère une exception
        id3({ file: path, type: id3.OPEN_LOCAL }, function(err, tags) {
          metadata['youtube'] = tags.v2['url-file'];
          db.insertSong(path, metadata, callback);
        });
      }
    }
    else {
      callback();
    }

  });
};
