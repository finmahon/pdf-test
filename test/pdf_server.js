var superagent = require('superagent')
var expect = require('expect.js')

describe('express rest api server', function() {
    var id;
    var url = 'http://127.0.0.1:3000';

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
        superagent.post(url + '/api/pdf')
            .send({
                html: 'http://www.google.es',
                pdf: 'google.pdf'
            })
            .end(function(e, res) {
                console.log(res.file, res.body.name);
                console.log('error->', e);
                done();
            });
    });


});
