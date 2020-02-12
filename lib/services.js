'use strict';

var PDFClass = require('./pdf');
var Page = require('./page');
var Server = require('./server');

var Services = function (host, port) {

  this.HTMLtoPDF = function (req, res) {

    var html = req.body.html;
    var cssServer = req.body.css;
    var pageFormat = req.body.format;
    var orientation = req.body.orientation;

    console.log('\n', new Date().toISOString());
    console.log('format:', pageFormat || 'A4');
    console.log('orientation:', orientation || 'portrait');

    var page = new Page();
    var server = new Server({
      server: 'http://' + host + ':' + port
    });

    if (html) {

      page.setContent(html);
      page.patchCSS(cssServer);

      server.deploy(page.getPage());

      PDFClass.generate(server.getURL(), pageFormat, orientation, function(err, resp) {
        if (err) {
          console.log('error from pdf generate in HTMLtoPDF ', err);
        }
        else {
          console.log('file:', resp.filename);
          res.download(resp.filename);
          PDFClass.clean();
          server.clean();
        }
      });

    }
    else {
      res.send({
        msg: 'usage: type: POST  url: /api/pdf/{html}/{pdf} \n html: url of the page you want a snapshot. '
      });
    }
  };

  this.PDF = function (req, res) {

    console.log('PDF ', JSON.stringify(req.body))

    var urlName = req.body.url;
    var pageFormat = req.body.format;
    var orientation = req.body.orientation;

    console.log('format:', pageFormat || 'A4');
    console.log('orientation:', orientation || 'portrait');

    if (urlName) {
      PDFClass.generate(urlName, pageFormat, orientation, function (err, resp) {
        if (err) {
          console.log('error from pdf generate in PDF ', err);
        }
        else {
          console.log('file:', resp.filename);
          res.download(resp.filename);
          PDFClass.clean();
        }
      });
    }
    else {
      res.send({
        msg: 'usage: type: POST  url: /api/pdf/{html}/{pdf} \n url: url of the page you want a snapshot. \n pdf: name of the pdf you want back.'
      });
    }
  };
};

module.exports = Services;
