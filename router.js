var HomeController = require('./controllers/HomeController');

// Routes
module.exports = function(app){
    // Main Routes
    app.post('/', HomeController.Auth);
    app.get('/app', HomeController.App);
    app.get('/moods', HomeController.Moods);
    app.get('/genre/:id', HomeController.Genre);
    app.get('/resetGenre/:id', HomeController.ResetGenre);
    app.get('/search/:keywords', HomeController.Search);
    app.get('/searchSongPlayed/:songId', HomeController.searchSongPlayed);
    app.get('/admin', HomeController.Admin);
    app.get('/admin/resetSession', HomeController.ResetSessions);
    app.get('/admin/resetDatabase', HomeController.ResetDatabase);
    app.get('/admin/scanMusic', HomeController.ScanMusic);
};
