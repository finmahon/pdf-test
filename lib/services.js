var fs = require('fs');
var cheerio = require('cheerio');

var Services = function() {
    var pdf = require('./pdf');

    var generateUnique = function() {
        var tstamp = new Date().getTime();
        var random = Math.random() * (1000 - 1) + 1;
        return tstamp + '' + random;
    };

    this.info = function(req, res, next) {}

    var del = function(file) {
        setTimeout(function() {
            fs.unlinkSync(file);
        }, 5000);
    };

    var appendCSS = function(host, html) {
        var $ = cheerio.load(html);

        $('link').each(function(i, elem) {

            var route = host + $(this).attr('href');
            console.log(route);
            $(this).attr('href', route);
        });

        return $('html').html();
    }

    var deployPage = function(html, host) {
        var uniqueId = generateUnique();
        var path = './public/';
        var uniqueFile = uniqueId + '.html';

        if(host){
            html = appendCSS(host, html);
        }

        fs.writeFileSync(path + uniqueFile, html);

        return {
            id: uniqueId,
            file: uniqueFile,
            absolute: path + uniqueFile,
            url: getUrl(uniqueFile)
        };
    };

    var getUrl = function(id) {
        var host = 'http://127.0.0.1:8001/'; //process env var.
        return host + id;
    };

    this.HTMLtoPDF = function(req, res, next) {
        var urlName = req.body.url;
        var html = req.body.html;
        var host = req.body.host;

        if (html) {
            var page = deployPage(html, host);
            var pdfName = page.id + '.pdf';
            var deployURL = getUrl(page.file);
            console.log('getting url -> ', page.url, ' pdf->' + pdfName);
            pdf.new(deployURL, pdfName, function(resp) {
                console.log('file ->', resp.filename);
                res.download(resp.filename);
                del(page.absolute);
                del(resp.filename);
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
        var pdfName = req.body.pdf;

        if (urlName && pdfName) {
            console.log('generating pdf');
            pdf.new(urlName, pdfName, function(resp) {
                console.log('file ->', resp.filename);
                res.download(resp.filename);
                del(resp.filename);
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

module.exports.Services = new Services;
