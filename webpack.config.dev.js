const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.config')

module.exports = () => webpackMerge(commonConfig(), {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client',
  ],
  output: {
    // path: path.resolve(__dirname, 'src'),
    path: '/',
    filename: 'bundle.[hash].js',
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
