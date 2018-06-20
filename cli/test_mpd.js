/* Test to validate that we can let MPD handle music playing and playlist management
 * To work this example need a configured MPD instance on localhost and very good musical taste
 */
var MPC = require('mpc-js').MPC;

var mpc = new MPC();

mpc.connectTCP('localhost', 6600);

mpc.currentPlaylist.clear();
mpc.currentPlaylist.add('Rick Astley/Never Gonna Give You Up.mp3');
mpc.playback.play();
