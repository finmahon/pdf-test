var expect = require('expect.js')
var pdf = require('../client/pdf')
var fs = require('fs');

//var url = { host: '127.0.0.1', port:3000 }
var url = {host: 'mbs-dte-2xwnt4xuvkzok77yafphbxo5-dev.ac.gen.nrm.feedhenry.com', port: 80}


describe('express rest api server', function() {
    it('importing', function() {
        var client = new pdf(url);
        expect(client).to.be.an('object');
    });

    try{
    fs.unlinkSync('./mypdf.pdf');
    fs.unlinkSync('./redirection.pdf');
    }catch(e){ console.log('delete files');}

    it('testing client downloading PDF', function(done) {
        this.timeout(35000);
        var client = new pdf(url);
        expect(client).to.be.an('object');

        var file = fs.createWriteStream('redirection.pdf');
        client.generatePDF('http://www.google.com', function(res) {
            console.log('boom');
            file.write(res.data);
            file.end();
            var filez = fs.lstatSync('./redirection.pdf').isFile();
            expect(filez).to.be.true;

            done();
        });
    });

    it('testing fromHTML', function(done) {
        this.timeout(35000);
        var client = new pdf(url);
        expect(client).to.be.an('object');

        var html = fs.readFileSync('./test.html').toString();
        var file = fs.createWriteStream('mypdf.pdf');
        client.fromHTML({html:html, host:'http://getbootstrap.com/examples/offcanvas/'}, function(res) {
            file.write(res.data);
            file.end();

            var filez = fs.lstatSync('./mypdf.pdf').isFile();
            expect(filez).to.be.true;
            done();
        });
    });


});
