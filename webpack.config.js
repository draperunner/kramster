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
    './src/main.tsx',
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /src|flexboxgrid/,
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
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: 'ts-loader',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.(eot|png|ttf|woff2?|otf)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve('src'),
      'node_modules',
    ],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss'],
  },
  plugins: [
    new CleanWebpackPlugin('./dist'),
    new Dotenv({ path: process.env.DOTENV_CONFIG_PATH }),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // "cp -r src/assets dist/assets && cp src/manifest.json dist/",
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'manifest.json' },
    ], { context: 'src' }),
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
