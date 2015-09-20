var fs = require('fs');

var TMPFile = function(dir, create) {


    var workingFolder;
    var file, ext;

    var initialize = function() {
        if (create) {
            var tmp = '../' + dir;

            if (!fs.existsSync(tmp)) {
                fs.mkdirSync(tmp);
            }

            workingFolder = tmp + '/';
        } else {
            workingFolder = __dirname + dir;
        }

    }();


    this.setFile = function(_file) {
        file = _file;
        return this;
    };

    this.getFile = function() {
        return file;
    };

    this.getAbsolutePath = function() {
        return workingFolder + '/' + file;
    };

    this.save = function(content) {
        fs.writeFileSync(this.getAbsolutePath(), content);
    };

    this.remove = function(interval) {
        var self = this;

        console.log('removing-> ', self.getAbsolutePath());
        setTimeout(function() {
            fs.unlinkSync(self.getAbsolutePath());
        }, interval || 5000);
    };
}

module.exports = TMPFile;
