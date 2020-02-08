var multer  = require('multer')
var upload = multer({ dest: './tmp/' })

var AuthController = require('./controllers/AuthController');
var DatabaseController = require('./controllers/DatabaseController');
var MusicController = require('./controllers/MusicController');
var ScanController = require('./controllers/ScanController');
var SuggestionController = require('./controllers/SuggestionController');

// Routes
module.exports = function(app){
    app.post('/login', AuthController.Login);

    app.get('/moods', MusicController.Moods);
    app.post('/mood/', MusicController.Mood);
    app.get('/whatsNew/:page', MusicController.whatsNew);
    app.get('/search/:keywords', MusicController.Search);
    app.post('/playedSong/:songId', MusicController.playedSong);
    app.post('/resetMoodSession/:id', MusicController.ResetMood);
    app.get('/admin/resetSession', MusicController.ResetSession);

    app.get('/suggestions', SuggestionController.List);
    app.post('/suggestion', upload.array('file'), SuggestionController.CreateSuggestion);
    app.post('/suggestion/message/:id', SuggestionController.CreateMessage);
    app.post('/suggestion/deleteFile', SuggestionController.DeleteFile);
    app.post('/suggestion/deleteSuggestion/:id', SuggestionController.DeleteSuggestion);

    app.get('/admin/resetDatabase', DatabaseController.Down);

    app.get('/admin/scanMusic', ScanController.ScanMusic);
};
