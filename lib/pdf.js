'use strict';

var path = require('path');
var phantomjs = require('phantomjs');
var phantom = require('phantom');

var TMPFile = require('./temp');

var options = {
  path: path.dirname(phantomjs.path) + '/'
};

var DEFAULT_DEPLOY_FOLDER = 'pdf_cache';

function getPDFCreator() {

  var _cli = null;
  var files = [];

  phantom.create(function(client) {
    _cli = client;
  }, options);

  return {

    generate: function(url, pageFormat, orientation, cb) {

      var tmpFile = new TMPFile(DEFAULT_DEPLOY_FOLDER, true);

      _cli.createPage(function(_page) {
        _page.set('paperSize', {
          format: pageFormat || 'A4',
          orientation: orientation || 'portrait',
        });

        _page.open(url, function() {

          tmpFile.setFile(new Date().getTime() + '.pdf');

          files.push(tmpFile);
          _page.render(tmpFile.getAbsolutePath(), function() {
            _page.close();
            cb({
              finish: true,
              filename: tmpFile.getAbsolutePath()
            });

          });
        });
      });
    },

    clean: function(cb) {

      var callback = cb || function(f) {
        console.log('pdf.clean:', f.getFile());
      };

      files.forEach(function(file) {
        file.remove(2000);
        files.splice(0, 1);
        callback(file);
      });
    }
  };
}

module.exports = getPDFCreator();
