'use strict';

var http = require('http');
var fs = require('fs');
var qstr = require('querystring');
var Buffer = require('buffer').Buffer;

var PDFCli = function(_options) {

  var opt = _options;
  var rest = {};
  rest.pdf = '/api/pdf';
  rest.html = '/api/html';

  var _download = function(data, cb, api) {

    var chunks = [];
    var options = {
      hostname: opt.host || '127.0.0.1',
      port: opt.port || 8001,
      path: api,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };

    var req = http.request(options, function(res) {

      res.on('data', function(data) {
        chunks.push(data);
      });

      res.on('end', function() {
        var buff = Buffer.concat(chunks);
        cb({
          data: buff,
          error: null
        });
      });

    });

    req.on('error', function(e) {
      console.error('problem with request: ' + e.message);
      cb({
        data: null,
        error: e
      });
    });

    // write data to request body
    req.write(data);
    req.end();
  }

  return {

    generatePDF: function(url, cb) {
      var postData = qstr.stringify({
        url: url,
        pdf: 'my_pdf.pdf'
      });
      _download(postData, cb, rest.pdf);
    },

    fromHTML: function(opt, cb) {
      var postData = qstr.stringify({
        html: opt.html,
        host: opt.host,
        pdf: 'html_pdf.pdf'
      });
      _download(postData, cb, rest.html);
    }
  }
}

module.exports = PDFCli;
