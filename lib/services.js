
var Services = function(){
    var pdf  = require('./pdf');
    

    this.info = function(req, res, next){
	
    }
     
    this.PDF = function(req, res, next){
	var url = req.url;	
	var pdfName = req.pdf;
	
	pdf.new(url, pdfName, function(resp){ res.sendfile(resp.filename), {'root': '../'}  });
    };

}


module.exports.Services = new Services;
