var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var bodyParser = require('body-parser');

//var Server = require('./server');
// list the endpoints which you want to make securable here
var securableEndpoints;
// fhlint-begin: securable-endpoints
securableEndpoints = ['/hello'];
// fhlint-end

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());
app.use(bodyParser({
  limit: '10mb'
}));

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// fhlint-begin: custom-routes
var Service = new require('./lib/services');

var service = new Service(host, port);

app.post('/api/pdf', service.PDF);
app.post('/api/html', service.HTMLtoPDF);
// fhlint-end

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var server = app.listen(port, host, function() {
  console.log('PDF Service started at: ' + new Date() + ' on port: ' + port);
});
