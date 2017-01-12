const path = require('path');
const webpack = require('webpack');

const base = {
  entry: './src/client/main.jsx',
  output: {
    path: path.resolve(__dirname, 'src', 'client'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        loader: 'babel!svg-react-loader',
      },
    ],
  },
  resolve: {
    root: path.resolve('src', 'client'),
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: ['node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  base.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = base;
