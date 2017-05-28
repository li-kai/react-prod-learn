const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

const ROOT_DIR = path.join(__dirname, '..');
const PATHS = {
  src: path.join(ROOT_DIR, 'src'),
  dist: path.join(ROOT_DIR, 'dist'),
  public: path.join(ROOT_DIR, 'public'),
  node_modules: path.join(ROOT_DIR, 'node_modules'),
};

module.exports = {
  entry: path.join(PATHS.src, 'index.jsx'),
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: PATHS.src,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Prod Learn',  // HTML Title of document
      inject: true,               // Place scripts at the end of <body>
      template: path.join(PATHS.public, 'index.html'),
    }),
    new DotenvWebpackPlugin({
      safe: true, // load .env.example
    }),
  ],
};
