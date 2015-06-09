var path = require('path');
var phantomjs = require('phantomjs')
var phantomPath = phantomjs.path;
var phantom = require('phantom');
var options = { path: path.dirname(phantomjs.path) + '/' };
var dir = './pdf/';

function getPDFCreator() {
	var _cli = null;
	phantom.create( function(client){ _cli = client; } ,options);
	
	return { new : function(url, pdfName, cb){
		_cli.createPage(function(_page){ 
			_page.set('paperSize',{format:'A4'});
			_page.open(url, function(stats){ _page.render(dir + pdfName, function(){ _page.close(); cb({finish:true, filename:dir+pdfName}); });   }); 
		});
	}, 
	clean : function(){
		
	}

	}
}

var instance = getPDFCreator();
module.exports = instance;
