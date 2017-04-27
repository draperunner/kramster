const path = require('path');
const webpack = require('webpack');

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
        exclude: /node_modules/,
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
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: ['react-hot-loader', 'babel-loader'],
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', 'svg-react-loader'],
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|nb/),
  ],
});
