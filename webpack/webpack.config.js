const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_DIR = path.join(__dirname, '..');
const PATHS = {
  src: path.join(ROOT_DIR, 'src'),
  dist: path.join(ROOT_DIR, 'dist'),
  public: path.join(ROOT_DIR, 'public'),
  node_modules: path.join(ROOT_DIR, 'node_modules'),
};

require('dotenv').config({ path: path.join(ROOT_DIR, '.env.development') });

module.exports = {
  entry: path.join(PATHS.src, 'index.js'),
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
    // Silly webpack, environment variables aren't injected by default
    new webpack.EnvironmentPlugin(['NODE_ENV', 'BABEL_ENV']),
    new HtmlWebpackPlugin({
      title: 'React Prod Learn',  // HTML Title of document
      inject: true,               // Place scripts at the end of <body>
      template: path.join(PATHS.public, 'index.html'),
    }),
    // Ignore node_modules so CPU usage with poll
    // watching drops significantly.
    new webpack.WatchIgnorePlugin([
      PATHS.node_modules,
    ]),
  ],
  devServer: {
    // Enable history API fallback so HTML5 History API based
    // routing works. Good for complex setups.
    historyApiFallback: true,

    // Parse host and port from env to allow customization.
    //
    // If you use Docker, Vagrant or Cloud9, set
    // host: options.host || '0.0.0.0';
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
  },
};
