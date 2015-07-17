var fs = require('fs');
var cheerio = require('cheerio');

var html = fs.readFileSync('./test.html').toString();
var appendCSS = function(host, html) {
    var $ = cheerio.load(html);

    $('link').each(function(i, elem) {

        var route = host + $(this).attr('href');
        console.log(route);
        $(this).attr('href', route);
    });

    console.log($('html').html());
}


appendCSS('http://getbootstrap.com/examples/offcanvas/', html);
