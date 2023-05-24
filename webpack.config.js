const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = () => ({
  context: __dirname,
  entry: ['./src/main.tsx'],
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /src|flexboxgrid/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              importLoaders: 1,
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
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: 'ts-loader',
      },
      {
        test: /\.(eot|png|ttf|woff2?|otf)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    modules: [path.resolve('src'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({ path: process.env.DOTENV_CONFIG_PATH }),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // "cp -r src/assets dist/assets && cp src/manifest.json dist/",
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
          context: 'src',
        },
        { from: 'manifest.json', context: 'src' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
    }),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }),
  ],
})
