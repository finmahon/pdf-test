
var mPDF = function(app){

    var routing = function(app){
        app.use('/api/pdf', this.generatePDF);
    }(app);

    this.generatePDF = function(req, res, next){
        console.log('service !!!'); 
    };

}


module.exports.mPDF = mPDF;
