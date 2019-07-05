var fs = require('fs');
var csv = require('csv-array');
var rc522 = require("rc522");

var playSongFromMoodName = require('./test_song_playing_from_mood_name.js');

var path = "./config/RFIDTagMoodMatch.csv";

// Setting absolute path, useful when used as a service
if (!fs.existsSync(path)) {
    path = "/home/pi/dev/Hippymood/config/RFIDTagMoodMatch.csv";
}

csv.parseCSV(path, function(csvData){
   console.log("Ready to rock !");

   var lastMoodName = '';

   rc522(function(rfidSerialNumber){
	   // Finding the mood index in the parsed CSV
	   var index = csvData.findIndex(function(item, i){
	     return item.tag === rfidSerialNumber
	   });
	   if (index !== -1) {
	     var moodName = csvData[index].mood;
	   }

	   if (rfidSerialNumber === "041dfc82665a81") {
	       playSongFromMoodName.NextSong();
               console.log("Skipping to next song");
	   }
	   else if (moodName === lastMoodName) {
               console.log("already playing that mood");
	   }
	   else if (index !== -1) {
	       console.log(moodName + " - " + rfidSerialNumber);

	       playSongFromMoodName.PlayMood(moodName);
	       lastMoodName = moodName;
	   } else {
	       console.log("No mood found for this tag : " + rfidSerialNumber);
	   }
    });
});
