var AuthController = require('./controllers/AuthController');
var AdminController = require('./controllers/AdminController');
var MusicController = require('./controllers/MusicController');
var ScanController = require('./controllers/ScanController');

// Routes
module.exports = function(app){
    app.post('/', AuthController.Unlock);
    app.post('/login', AuthController.Login);

    app.get('/moods', MusicController.Moods);
    app.post('/mood/', MusicController.Mood);
    app.get('/resetMood/:id', MusicController.ResetMood);
    app.get('/newSongs/:page', MusicController.newSongs);
    app.get('/search/:keywords', MusicController.Search);
    app.get('/searchSongPlayed/:songId', MusicController.searchSongPlayed);
    app.get('/admin/resetSession', MusicController.ResetSession);

    app.get('/admin/resetDatabase', AdminController.ResetDatabase);

    app.get('/admin/scanMusic', ScanController.ScanMusic);
};
