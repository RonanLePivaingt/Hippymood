var id3 = require('id3js');

id3({ file: './music/06 Donde Estas, Yolanda_.mp3', type: id3.OPEN_LOCAL }, function(err, tags) {
    console.log("Information sur la piste : " + JSON.stringify(tags));
});
