const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = () => ({
  context: __dirname,
  entry: [
    'whatwg-fetch',
    './src/client/main.jsx',
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /src\/client|flexboxgrid/,
        loaders: [
          'style-loader', {
            loader: 'css-loader',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        exclude: /flexboxgrid/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel'],
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve('src', 'client'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  plugins: [
    new CleanWebpackPlugin('./dist'),
    new Dotenv({ path: process.env.DOTENV_CONFIG_PATH }),
    new HtmlWebpackPlugin({ template: 'src/client/index.html' }),
    // "cp -r src/client/assets dist/client/assets && cp src/client/manifest.json dist/client/",
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'manifest.json' },
    ], { context: 'src/client' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      KRAMSTER_TRACKING_ID: JSON.stringify(process.env.KRAMSTER_TRACKING_ID),
    }),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|nb/),
  ],
})
