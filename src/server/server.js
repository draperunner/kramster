var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

// MongoDB
mongoose.connect('mongodb://localhost/kramster');

// Express
var app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use(express.static(__dirname + '/../client/'));
app.use('/doc', express.static(__dirname + '/../../doc/'));
app.use('/api/exams', require('./api/exams'));
app.use('/api/reports', require('./api/reports'));
app.use('/api/stats', require('./api/stats'));
app.use('/api/list', require('./api/list'));

app.use(function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

// Start server
var port = 8000;
app.listen(port, '127.0.0.1');
console.log('Server is running on port ' + port);
