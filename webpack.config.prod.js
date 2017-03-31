const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.config.js');

module.exports = () => webpackMerge(commonConfig(), {
  output: {
    path: path.join(__dirname, 'dist', 'client'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
