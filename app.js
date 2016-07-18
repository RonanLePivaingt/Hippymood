var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', { title: 'Hippymood', message: 'Hello there!'});
});

app.use('/music', express.static('music'));

app.listen(app.get('port'), function () {
      console.log('Example app listening on port ' + app.get('port') + '!');
});
