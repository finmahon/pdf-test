var fs = require('fs');
var PDFClass = require('./pdf');
var Page = require('./page');
var Server = require('./server');

var Services = function(host, port) {

    this.HTMLtoPDF = function(req, res, next) {

        var urlName = req.body.url;
        var html = req.body.html;
        var host = req.body.host;

        var page = new Page();
        var server = new Server({
            server: 'http://' + host + ':' + port
        });

        if (html) {

            page.setContent(html);
            page.patchCSS(host);

            server.deploy(page.getPage());

            PDFClass.generate(server.getURL(), pdfName, function(resp) {
                res.download(resp.filename);
            });

        } else {
            res.send({
                msg: 'usage: type: POST  url: /api/pdf/{html}/{pdf} \\n \
                     html: url of the page you want a snapshot. '
            });
        }
    };

    this.PDF = function(req, res, next) {
        var urlName = req.body.url;
        if (urlName) {
            console.log('generating pdf');
            PDFClass.generate(urlName, function(resp) {
                console.log('file ->', resp.filename);
                res.download(resp.filename);
            });
        } else {
            res.send({
                msg: 'usage: type: POST  url: /api/pdf/{html}/{pdf} \\n \
                      url: url of the page you want a snapshot. \
                      pdf: name of the pdf you want back.'
            });
        }
    };
}

module.exports = Services;
