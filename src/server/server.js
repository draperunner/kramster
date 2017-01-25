import bluebird from 'bluebird';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const webpack = require('webpack');

const app = express();

// Webpack
/* eslint-disable global-require */
  // Step 1: Create & configure a webpack compiler
const webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../../webpack.config');
const compiler = webpack(webpackConfig);

  // Step 2: Attach the dev middleware to the compiler & the server
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath,
}));

  // Step 3: Attach the hot middleware to the compiler & the server
app.use(require('webpack-hot-middleware')(compiler));

// MongoDB
mongoose.connect('mongodb://localhost/kramster');
mongoose.Promise = bluebird;

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
