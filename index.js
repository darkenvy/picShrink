var fs = require('fs');
var im = require('imagemagick');
var supportedFiles = ['jpg', 'jpeg', 'png', 'gif']

function readdir(dir, imgLocations) {
  var current = fs.readdirSync(dir);
  for (var each in current) {
    if ( fs.statSync(dir + current[each]).isDirectory() ) {
      readdir(dir + current[each] + '/', imgLocations);
    } else {
      var ext = /\.(\w{1,3})$/.exec(dir + current[each])
      if (ext && ext[1] && supportedFiles.indexOf(ext[1].toLowerCase()) !== -1) {
        imgLocations.push(dir + current[each]);
      }
    }
  }
  return imgLocations;
}

function compareSize(originalFilename, newFilename) {

}

function identify(filename) {
  return new Promise(function(resolve, reject) {
    im.identify(filename, function(err, features) {
      if (err) reject(err);
      resolve(features);
    })
  })
}

function convert(filename) {
  var arguments = [filename];
  identify(filename)
  .then(function(meta) {
    if (meta.format == 'PNG') {}
    if (meta.format == 'JPEG') {}
    if (meta.colorspace != 'sRGB') {}
    if (meta.depth > 8) {}
  })
  .then(function() {
    console.log(filename);
  })

}

var imageLocations = readdir(__dirname + '/in/', []);
// console.log(imageLocations);
convert(imageLocations[0])