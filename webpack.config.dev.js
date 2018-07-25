import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';

module.exports = () => webpackMerge(commonConfig(), {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client',
  ],
  output: {
    // path: path.resolve(__dirname, 'src', 'client'),
    path: '/',
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
