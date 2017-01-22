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
  return fs.unlinkSync(filename);
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
      if (err) console.log(err);
      resolve();
      // console.log('stdout: ', stdout);
    })
  })
}

function overwriteImage(originalFilename) {
  setTimeout(function() {
    fs.rename(originalFilename + '.out', originalFilename, function() {
      console.log('renamed: ', originalFilename);
    });
  },1000);

}

function processImage(filename) {
  var imgArgs = [filename];
  identify(filename)
  .then(function(meta) {
    if (meta.format == 'PNG') imgArgs.push('-define', 'png:compression-level=9');
    if (meta.colorspace != 'sRGB') imgArgs.push('-colorspace', 'sRGB');
    if (meta.depth > 8) imgArgs.push('-depth', '8');
    if (meta.interlace != 'None') imgArgs.push('-interlace', 'none');
    if (meta.width > 50) imgArgs.push('-posterize', '32'); // remove from if and compare icons before/after
    imgArgs.push('-dither', 'Riemersma');
    imgArgs.push('-quality', '82'); // dont move. needs to be second to last
    imgArgs.push(filename + '.out');
  })
  .then(function() {
    return convert(imgArgs)
  })
  .then(function() {
    if (!isNewSmaller(filename) && imgArgs[imgArgs.length - 3] == '-quality') {
      // Retry without '-quality 82' setting
      imgArgs.splice(imgArgs.length - 3, 2);
      convert(imgArgs).then(function() {
        console.log('re-converted');
        if (!isNewSmaller(filename)) {
          console.log('after all that, not even smaller');
          deleteFile(filename + '.out');
        }
      });
    } 
    else { console.log('new is smaller!'); return; }
  })
  .then(function() {
    return overwriteImage(filename)
    // at this point, all .out files are smaller than the originals
    // overwrite the orignals and cleanup
  })

}

// Initial Run Setup
if (!fs.existsSync(__dirname + '/out')) fs.mkdirSync(__dirname + '/out');
if (!fs.existsSync(__dirname + '/in')) {
  fs.mkdirSync(__dirname + '/in');
  console.log('Created \'in\' directory.')
  console.log('Place directory of files to convert in the \'in\' folder and rerun.');
  console.log('Folders may contain other files and will process images in-place.');
  process.exit();
}

// Actual Run
var imageLocations = readdir(__dirname + '/in/', []);
// processImage(imageLocations[2])
imageLocations.forEach(function(file) {
  console.log('processing ', file);
  processImage(file);
})