const path = require('path');
const webpack = require('webpack');

const res = p => path.resolve(__dirname, p);

const entry = res('../server/render.js');
const output = res('../buildServer');

module.exports = {
  name: 'server',
  target: 'node',
  // devtool: 'source-map',
  devtool: 'eval',
  entry: [entry],
  resolve: {
    extensions: ['.js', '.css', '.scss'],
  },
  output: {
    path: output,
    filename: '[name].js',
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
