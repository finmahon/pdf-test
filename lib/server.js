var TMPFile = require('./temp');
var DEFAULT_FILE_TYPE = '.html';
var DEFAULT_DEPLOY_FOLDER = '/../public/';


var Server = function(_options) {
    var url, rootURL;
    var tmpFile = new TMPFile(DEFAULT_DEPLOY_FOLDER);

    var publishURL = function(file) {
        url = rootURL + '/' + file;
    }

    this.remove = function(interval) {
        tmpFile.remove(interval);
    }

    this.deploy = function(content, extension) {
        var tstamp = new Date().getTime();
        var name = tstamp + '_' + Math.random() * (1000 - 1) + 1;
        var ext = extension || DEFAULT_FILE_TYPE;

        tmpFile.setFile(name + ext);
        publishURL(tmpFile.getFile());

        tmpFile.save(content);
    };

    this.setHostConfig = function(_opts) {
        var options = _opts || {};

        rootURL = (options.server || 'http://127.0.0.1:3000');
        deployPath = options.path || DEFAULT_DEPLOY_FOLDER;
    }

    this.getURL = function() {
        return url;
    };

    this.getFile = function() {
        return tmpFile.getAbsolutePath();
    };

    /* constructor */
    this.setHostConfig(_options);
}

module.exports = Server;
