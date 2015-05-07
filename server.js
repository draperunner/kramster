/**
 * Created by mats on 30.04.15.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();

// MongoDB
mongoose.connect('mongodb://localhost/test');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));
//app.use('/api', router);

// Start server
app.listen(5600);
console.log("Server is running on port 5600");