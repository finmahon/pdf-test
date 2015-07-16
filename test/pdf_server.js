var superagent = require('superagent')
var expect = require('expect.js')

describe('express rest api server', function() {
    var id

    it('bad post data should return an error', function(done) {
        superagent.post('http://localhost:8001/api/pdf')
            .send({
                name: 'John',
                email: 'john@rpjs.co'
            })
            .end(function(e, res) {
                expect(e).to.eql(null);
                expect(res.body.msg).to.eql('usage: type: POST  url: /api/pdf  param {urlName:url where your html page is?, pdf: name of the generated pdf }');
                done();
            });
    });

    it('generating pdf', function(done) {
        superagent.post('http://localhost:8001/api/pdf')
            .send({
                html: 'http://www.google.es',
                pdf: 'google.pdf'
            })
            .end(function(e, res) {
                console.log(res);
                console.log(res.file, res.body.name);
                console.log('error->', e);
                done();
            });
    });


});
