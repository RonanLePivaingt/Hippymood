var MPC = require('mpc-js').MPC;
var mpc = new MPC();
var arduino = require('./arduino.js');

mpc.connectTCP('localhost', 6600);

/*
 * Replace current playlist with provided songs
 */
exports.playSongs = (songs) => {
    return new Promise((resolve, reject) => {
        mpc.currentPlaylist.clear();
        for (var i in songs) {
            mpc.currentPlaylist.add(songs[i].path.slice(6));
        }
        mpc.playbackOptions.setRandom(true);
        mpc.playback.play();
    });
};

/*
 * Play next song
 */
exports.nextSong = new Promise((resolve, reject) => {
    mpc.playback.next();
    resolve("Skipping this song");
});


/*
 * Watching mpd status to update Arduino's behavior
 */
mpc.on('changed-player', () => { 
    mpc.status.status().then(status => { 
        if (status.state == 'play') { 
            // Start motor
            // arduino.execute('motorStart');
            arduino.execute('s');
            console.log("MPD - Play");
        } else if (status.state == 'pause') { 
            // Stop motor
            console.log("MPD - Pausing");
            // arduino.execute('motorStop');
            arduino.execute('m');
        }
    });
});
