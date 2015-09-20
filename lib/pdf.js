'use strict';
var path = require('path');
var phantomjs = require('phantomjs')
var phantomPath = phantomjs.path;
var phantom = require('phantom');

var TMPFile = require('./temp');

var options = {
    path: path.dirname(phantomjs.path) + '/'
};

var DEFAULT_FILE_TYPE = '.pdf';
var DEFAULT_DEPLOY_FOLDER = 'pdf_cache';



function getPDFCreator() {
    var _cli = null;
    var files = [];
    phantom.create(function(client) {
        _cli = client;
    }, options);

    return {
        generate: function(url, cb) {
            var tmpFile = new TMPFile(DEFAULT_DEPLOY_FOLDER, true);

            _cli.createPage( function(_page) {
                _page.set('paperSize', {
                    format: 'A4'
                });

                _page.open(url, function(stats) {

                    tmpFile.setFile(new Date().getTime() + '.pdf');

                    files.push(tmpFile);     
                    _page.render(tmpFile.getAbsolutePath(), function() {
                        _page.close();
                        cb({
                            finish: true,
                            filename: tmpFile.getAbsolutePath()
                        });

                    });
                });
            });
        },

        clean: function(cb){
            var callback = cb || function(f){ console.log('deleted->', f.getFile())};   
           
            console.log('files.length:', files.length); 
            files.forEach(function(file){
                console.log('schedule file', file.getFile(), ' delete in 2000ms');
                file.remove(2000);
                files.splice(0,1);
                callback(file);
            });
        }
    }
};


module.exports = getPDFCreator();
