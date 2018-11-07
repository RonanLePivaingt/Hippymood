var multer  = require('multer')
var upload = multer({ dest: './tmp/' })

var AuthController = require('./controllers/AuthController');
var DatabaseController = require('./controllers/DatabaseController');
var MusicController = require('./controllers/MusicController');
var ScanController = require('./controllers/ScanController');
var SuggestionController = require('./controllers/SuggestionController');

// Routes
module.exports = function(app){
    app.post('/api', AuthController.Unlock);
    app.post('/api/login', AuthController.Login);

    app.get('/api/moods', MusicController.Moods);
    app.post('/api/mood/', MusicController.Mood);
    app.get('/api/resetMood/:id', MusicController.ResetMood);
    app.get('/api/newSongs/:page', MusicController.newSongs);
    app.get('/api/search/:keywords', MusicController.Search);
    app.get('/api/searchSongPlayed/:songId', MusicController.searchSongPlayed);
    app.get('/api/admin/resetSession', MusicController.ResetSession);

    app.get('/api/suggestions', SuggestionController.List);
    app.post('/api/suggestion', upload.array('file'), SuggestionController.CreateSuggestion);
    app.post('/api/suggestion/message/:id', SuggestionController.CreateMessage);
    app.post('/api/suggestion/deleteFile', SuggestionController.DeleteFile);
    app.post('/api/suggestion/deleteSuggestion/:id', SuggestionController.DeleteSuggestion);

    app.get('/api/admin/resetDatabase', DatabaseController.Down);

    app.get('/api/admin/scanMusic', ScanController.ScanMusic);
};
