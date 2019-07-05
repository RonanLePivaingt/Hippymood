// Conf and RFID dependencies
var rc522 = require("rc522");
var db = require('./db.js');
var mpc = require('./mpc.js');

// Loading associative mood list
db.getMoodList.then(data => {
    associativeMoodList = data;

    console.log('Ready !');

    // On vinyle detection
    rc522(function(rfidSerialNumber){
        db.getSerialNumberMoodName(rfidSerialNumber, associativeMoodList)
            .then(moodName => db.getMoodSongs(moodName))
            .then(songs => mpc.playSongs(songs))
        ;
    });
});
