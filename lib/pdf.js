'use strict';

var phantom = require('phantom');

var TMPFile = require('./temp');

var DEFAULT_DEPLOY_FOLDER = 'pdf_cache';

var _cli = null;
var files = [];

var pdfCreator = {}

pdfCreator.generate = function (url, pageFormat, orientation, zoomFactor, width, height,cb) {

  var tmpFile = new TMPFile(DEFAULT_DEPLOY_FOLDER, true);
  var _page;

  var client = _cli ? Promise.resolve(_cli) : phantom.create();

  client.then(function (client) {
    _cli = client;
    return _cli.createPage()
  })
    .then(function (page) {
      _page = page;

      if (pageFormat) {
        console.log('pageFormat ', pageFormat)
        return _page.property('paperSize', {
          format: pageFormat || 'A4',
          orientation: orientation || 'portrait',
        });
      } else if (zoomFactor) {
        console.log('zoomFactor ', zoomFactor)
        return _page.property('zoomFactor', zoomFactor);
      }else if (width) {
        console.log('width ', width, height)
        return _page.property('paperSize', {
          width: width,
          height: height,
        });
      }
      return _page

    })
    .then(function () {
      return _page.open(url);
    })
    .then(function (status) {
      console.log('open status = ', status);
      tmpFile.setFile(new Date().getTime() + '.pdf');

      files.push(tmpFile);
      return _page.render(tmpFile.getAbsolutePath());
    })
    .then(function (render) {
      _page.close();
      return cb(null, {
        finish: true,
        filename: tmpFile.getAbsolutePath()
      });
    })
    .catch(function (e) {
      console.log(e);
      cb(e, null);
    });
};

pdfCreator.clean = function (cb) {

  var callback = cb || function (f) {
    console.log('pdf.clean:', f.getFile());
  };

  files.forEach(function (file) {
    file.remove(2000);
    files.splice(0, 1);
    callback(file);
  });
};

module.exports = pdfCreator;