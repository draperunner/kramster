import bluebird from 'bluebird';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// MongoDB
mongoose.connect('mongodb://localhost/kramster');
mongoose.Promise = bluebird;

// Express
const app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use(express.static(`${__dirname}/../client/`));
app.use('/doc', express.static(`${__dirname}/../../doc/`));
app.use('/api/exams', require('./api/exams'));
app.use('/api/reports', require('./api/reports'));
app.use('/api/stats', require('./api/stats'));
app.use('/api/list', require('./api/list'));

app.use((req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});

// Start server
const port = 8000;
app.listen(port, '127.0.0.1');
/* eslint-disable no-console */
console.log(`Server is running on port ${port}`);
