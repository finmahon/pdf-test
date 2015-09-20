var fs = require('fs');
var superagent = require('superagent')
var expect = require('chai').expect;
var path = require('path');

var Service = require('../lib/service');

describe('TMPFile class', function() {
    var service = new Service();

    it('initialization', function() {
        expect(service).to.be.an('object');
    });
    
});

