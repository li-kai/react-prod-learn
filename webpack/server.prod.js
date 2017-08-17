const path = require('path');
const webpack = require('webpack');

const PATHS = require('../config/paths');

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [path.join(PATHS.src, 'server', 'index.js')],
  resolve: {
    extensions: ['.js', '.css', '.scss'],
  },
  output: {
    path: PATHS.dist,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
