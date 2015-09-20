var fs = require('fs');
var querystring = require('querystring');
var http = require('http');
var superagent = require('superagent')
var expect = require('chai').expect;
var path = require('path');

var PDF = require('../lib/pdf');
var Server = require('../lib/server');
var Page = require('../lib/page');
var TMPFile = require('../lib/temp');

/*
describe('TMPFile class', function() {

    var tmpFile;
    it('initialization', function() {
        tmpFile = new TMPFile('../public');
        expect(tmpFile).to.be.an('object');
    });

});
*/
describe('Page class', function() {
    var page;

    it('initialization', function() {
        page = new Page();
        expect(page).to.be.an('object');
    });

    it('get empty data', function() {
        expect(page.getContent).to.be.a("function");
        expect(page.getContent).to.throw(Error);
        expect(page.getContent).to.throw(/Missing HTML/);
    });

    it('page#setContent', function() {
        var html = fs.readFileSync('./test.html').toString();

        page.setContent(html);
        expect(page.getContent().length).to.be.equals(html.length);
    });

    it('page#patchCSS', function() {
        page = new Page();
        var html = "<html><head> <link href=\"../../dist/css/bootstrap.min.css\" rel=\"stylesheet\"></head> <body></body> </html>"
        page.setContent(html);
        expect(page.getContent().length).to.be.equals(html.length);
        page.patchCSS('http://getbootstrap.com/');
        console.log(page.getPage());
    });

});

describe('Server Class', function() {

    var server = null;

    it(' Server object', function() {
        server = new Server();
        expect(server).to.be.an('object');
    });

    it('Server#deploy', function() {
        var html = fs.readFileSync('./test.html').toString();

        server.deploy(html);

        var filez = fs.existsSync(server.getFile());
        console.log('url->', server.getURL());
        expect(filez).to.be.true;
    });

    it('Server#clean', function(done) {
        server.remove(1000);

        setTimeout(function() {
            var filez = fs.existsSync(server.getFile());
            expect(filez).to.be.false;
            done();
        }, 1500);
    });

});


describe('PDF class', function() {

    it('initialization', function() {
        expect(PDF).to.be.an('object');
    });

    this.timeout(6000);
    it('PDF#generate', function(done) {
        expect(PDF).to.be.an('object');

        setTimeout(function() {
            PDF.generate('http://www.google.es', function(resp) {
                console.log('file->', resp);

                var filez = fs.existsSync(resp.filename);
                expect(filez).to.be.true;
                done();
            });
        }, 1900);
    });


    it('PDF#clean', function(done) {
        expect(PDF).to.be.an('object');

        setTimeout(function() {
            PDF.clean(function(file) {

                setTimeout(function() {
                    var filez = fs.existsSync(file.getAbsolutePath());
                    expect(filez).to.be.false;
                    done();
                }, 1500);
            });
        }, 1900);
    });

});


describe('express rest api server', function() {

    var id;
    var url = 'http://127.0.0.1:3000';
    var data = querystring.stringify({
        'url': 'http://www.google.com'
    });

    var options = {
        host: '192.168.0.12',
        port: 3000,
        path: '/api/pdf',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };
    var file = fs.createWriteStream('generated.pdf');

    it('bad post data should return an error', function(done) {
        superagent.post(url + '/api/pdf')
            .send({
                name: 'John',
                email: 'john@rpjs.co'
            })
            .end(function(e, res) {
                expect(res.body.msg).to.not.empty;
                expect(e).to.eql(null);
                done();
            });
    });


    it('generating pdf', function(done) {
        var req = http.request(options, function(res) {
            res.on('data', function(data) {
                file.write(data);
                console.log('data->', data);
            }).on('end', function() {
                file.end();
                console.log('finish..');
                done();
            });
        });


        req.write(data);
        req.end();


    });

});
