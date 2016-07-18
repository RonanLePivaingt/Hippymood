var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'pug');

app.use('/music', express.static('music'));
app.use('/public', express.static('public'));

// send app to router
require('./router')(app);

app.listen(app.get('port'), function () {
      console.log('Example app listening on port ' + app.get('port') + '!');
});
