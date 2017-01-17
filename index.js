var fs = require('fs');
var supportedFiles = ['jpg', 'jpeg', 'png', 'gif']

var imageLocations = [];
function readdir(dir) {
  var current = fs.readdirSync(dir);
  for (var each in current) {
    if ( fs.statSync(dir + current[each]).isDirectory() ) {
      readdir(dir + current[each] + '/', false);
    } else {
      var ext = /\.(\w{1,3})$/.exec(dir + current[each])
      if (ext && ext[1] && supportedFiles.indexOf(ext[1].toLowerCase()) !== -1) {
        imageLocations.push(dir + current[each]);
      }
    }
  }
  return imageLocations;
}

var all = readdir(__dirname + '/in/');
console.log(all);