'use strict';

var fs = require('fs');

var TMPFile = function(dir, create) {

  var workingFolder;
  var file;

  var initialize = function() {
    var tmp = __dirname.replace('lib', '') + dir;
    if (create) {

      if (!fs.existsSync(tmp)) {
        fs.mkdirSync(tmp);
      }
    }

    workingFolder = tmp + '/';
  };

  initialize();

  this.setFile = function(_file) {
    file = _file;
    return this;
  };

  this.getFile = function() {
    return file;
  };

  this.getAbsolutePath = function() {
    return workingFolder + '/' + file;
  };

  this.save = function(content) {
    fs.writeFileSync(this.getAbsolutePath(), content);
  };

  this.remove = function(interval) {
    var self = this;

    setTimeout(function() {
      console.log('temp.remove:', self.getAbsolutePath());
      fs.unlinkSync(self.getAbsolutePath());
    }, interval || 5000);
  };
};

module.exports = TMPFile;
