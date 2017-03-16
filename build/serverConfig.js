// Example configuration file, to be renamed as config.js and with the good values
var config = {};

// Database credentials
config.db = {};
config.db.host = "localhost";
config.db.user = "dirty_hippy";
config.db.password = "dirty_password";
config.db.database = "hippymood";

// Authentification
config.auth = {};
config.auth.activate = 0; /* 1 to activate authentification, 0 to disable */

// Time in milliseconds since last visit before reseting the list of played songs (3600000 milliseconds is 1 hour)
config.songList = {};
config.songList.timeSinceVisitReset = 28800000; // 8 hour

module.exports = config;
