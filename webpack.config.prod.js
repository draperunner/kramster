const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');

module.exports = () => webpackMerge(commonConfig(), {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist', 'client'),
    filename: 'bundle.[hash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
