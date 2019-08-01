// Conf and RFID dependencies
let rc522 = require("rc522");
let db = require('./db.js');
let mpc = require('./mpc.js');

// Loading associative mood list
db.getMoodList.then(data => {
    let associativeMoodList = data;
    let lastMoodRfidSerialNumber = '';

    console.log('Ready !');

    // On vinyle detection
    rc522(function(rfidSerialNumber){
        // Checking if the mood is already played
        if (rfidSerialNumber !== lastMoodRfidSerialNumber) {
            lastMoodRfidSerialNumber = rfidSerialNumber;

            db.getSerialNumberMoodName(rfidSerialNumber, associativeMoodList)
                .then(moodName => db.getMoodSongs(moodName))
                .then(songs => mpc.playSongs(songs))
            ;
        }
    });
});
