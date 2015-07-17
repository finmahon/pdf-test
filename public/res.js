/*
 *  Fetch: this class load all the resources async.
 */
var Fetch = function() {
    var self = this;
    var data = {};
    var deferred = null;
    var count = 0;
    var filename = function(fname) {
        return fname.substr(fname.lastIndexOf('/') + 1, fname.length)
    };
    var download = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function(e) {
            if (e) console.log(e);
            if (this.status == 200) {
                data[url] = this.response;
                count--;
                if (!count) deferred(data);
            } else {
                console.log('conectivity problem:', this.status);
            }
        }
        xhr.send();
    };

    this.download = function(resource, callback) {
        count = resource.length;
        resource.forEach(function(filename) {
            download(filename);
        });
        deferred = callback;
    };
}

