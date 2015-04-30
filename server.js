/**
 * Created by mats on 30.04.15.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// MongoDB
mongoose.connect('mongodb://localhost/rest-test');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.get('/', function(req, res) {
   res.send("Hello!");
});

app.listen(5600);
console.log("Server is running on port 5600");