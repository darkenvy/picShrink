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

function deleteFile(filename) {
  return fs.unlink(filename);
}

function isNewSmaller(originalFilename) {
  var original = fs.statSync(originalFilename).size;
  var converted = fs.statSync(originalFilename + '.out').size;
  return original > converted ? true : false;
}

function identify(filename) {
  return new Promise(function(resolve, reject) {
    im.identify(filename, function(err, features) {
      if (err) reject(err);
      resolve(features);
    })
  })
}

function convert(imageArgs) {
  return new Promise(function(resolve, reject) {
    im.convert(imageArgs, function(err, stdout) {
      // console.log('stdout: ', stdout);
    })
  })
}

function main(filename) {
  var imgArgs = [filename];
  identify(filename)
  .then(function(meta) {
    if (meta.format == 'PNG') imgArgs.push('-define', 'png:compression-level=9');
    if (meta.colorspace != 'sRGB') imgArgs.push('-colorspace', 'sRGB');
    if (meta.depth > 8) imgArgs.push('-depth', '8');
    if (meta.interlace != 'None') imgArgs.push('-interlace', 'none');
    imgArgs.push('-posterize', '32');
    imgArgs.push('-dither', 'Riemersma');
    imgArgs.push('-quality', '82');
    imgArgs.push(filename + '.out');
  })
  .then(function() {convert(imgArgs)})
  .then(function() {
    if (!isNewSmaller(filename)) {
      imgArgs.splice(imgArgs.length - 3, 2); // -quality 82 always at that loc
      convert(imgArgs)
      .then(function() {
        if (!isNewSmaller(filename)) deleteFile(filename);
      })
    }
    // at this point, all .out files are smaller than the originals
    // overwrite the orignals and cleanup

  })

}

var imageLocations = readdir(__dirname + '/in/', []);
// console.log(imageLocations);
main(imageLocations[0])