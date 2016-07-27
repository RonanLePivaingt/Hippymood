// Loading tags processing
var id3tags = require('./id3tags');

var fs = require('fs');
var path = require('path');

var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}
var files = walk("music");
// loop through array with all new ids
var i = 0, l = files.length;
console.log("Starting music scan");
(function iterator() {
    var filename = files[i];
    if (filename.slice(-3) == "mp3") {
        id3tags.scan(filename);
    }

    if(++i<l) {
        setTimeout(iterator, 50);
    }
    else
        console.log("Music scan done");
})();
