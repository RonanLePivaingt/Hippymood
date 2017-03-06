var HomeController = require('./controllers/HomeController');

// Routes
module.exports = function(app){
    // Checked routes for branch vue2fromscratch
    app.get('/app', HomeController.App);
    app.get('/moods', HomeController.Moods);
    app.get('/mood/:id', HomeController.Mood);
    app.get('/admin/resetSession', HomeController.ResetSession);

    // Old routes to be checked
    app.post('/', HomeController.Auth);
    app.get('/resetGenre/:id', HomeController.ResetGenre);
    app.get('/search/:keywords', HomeController.Search);
    app.get('/searchSongPlayed/:songId', HomeController.searchSongPlayed);
    app.get('/admin', HomeController.Admin);
    app.get('/admin/resetDatabase', HomeController.ResetDatabase);
    app.get('/admin/scanMusic', HomeController.ScanMusic);
};
