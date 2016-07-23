// Loading tags processing
var id3tags = require('./id3tags');

var fs = require('fs');
var path = require('path');
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

function listProcessing(IDontGetWhatThisVarIsFor, results) {
    results.forEach(function(name, index) {
    // Processing only mp3 files
        if (name.slice(-3) == "mp3") {
            id3tags.scan(name);
        }
    });
}

walk("music", listProcessing);
//walk("music/The Heavy", listProcessing);
