var fs = require('fs');

var TMPFile = function(dir, create) {


    var workingFolder;
    var file, ext;

    var initialize = function() {
        console.log('dir-> ',dir, ' create->', create);
        var tmp = __dirname + '/../' + dir;
        if (create) {

            console.log( 'TMPFile ->', tmp );

            if (!fs.existsSync(tmp)) {
                fs.mkdirSync(tmp);
            }

            workingFolder = tmp + '/';
        } else {
            workingFolder = tmp;
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
