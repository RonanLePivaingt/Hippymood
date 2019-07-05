// DB dependencies
var config = require('../config/server.config');
var dbConfig = require('../server/knex.js');
var knex = require('knex')(dbConfig);

// CSV dependencies
var fs = require('fs');
var csv = require('csvtojson');

/*
 * Function to get the mood and RFID associative list from CSV
 */
exports.getMoodList = new Promise((resolve, reject) => {
    var path = "./config/RFIDTagMoodMatch.csv";

    // Setting absolute path, useful when used as a service
    if (!fs.existsSync(path)) {
        path = "/home/pi/dev/Hippymood/config/RFIDTagMoodMatch.csv";
    }

    csv()
        .fromFile(path)
        .then((jsonObj)=>{
            resolve(jsonObj);
            // Placer directement plus haut
        })
});

/*
 * Function to get the mood and RFID associative list from CSV
 */
exports.getSerialNumberMoodName = (rfidSerialNumber, associativeMoodList) => {
    return new Promise((resolve, reject) => {
        // Finding the mood index in the parsed CSV
        var index = associativeMoodList.findIndex(function(item, i){
            return item.tag === rfidSerialNumber
        });
        if (index !== -1) {
            resolve(associativeMoodList[index].mood);
        } else {
            reject('Mood not found for tag ' + rfidSerialNumber);
        }
    });
};

/*
 * Function to get song paths from a mood name
 */
exports.getMoodSongs = (moodName) => {
    return new Promise((resolve, reject) => {
        var select = knex.select('songs.id', 'songs.name as song', 'artists.name AS artist', 'songs.path', 'albums.name AS album', 'songs.youtube', 'songs.created_at')
            .from('songs')
            .join('genres_relations', 'songs.id', '=', 'genres_relations.id_songs')
            .join('genres', 'genres_relations.id', '=', 'genres.id')
            .join('artists', 'artists.id', '=', 'songs.id_artists')
            .join('albums', 'albums.id', '=', 'songs.id_albums')
            .where('genres.name', moodName);

        select.then(function(rows) {
            if (rows.length > 0) {
                console.log("Starting " + moodName); 
                resolve(rows);
            } else {
                reject('No song found for mood');
            }
        })
    });
};
