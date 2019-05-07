var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

// Enable CORS for all requests
app.use(cors());

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

app.use(bodyParser({
  limit: '10mb'
}));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var Service = new require('./lib/services');
var service = new Service(host, port);

app.post('/api/pdf', service.PDF);
app.post('/api/html', service.HTMLtoPDF);

var server = app.listen(port, host, function() {
  console.log('PDF Service started at: ' + new Date() + ' on port: ' + port);
});
