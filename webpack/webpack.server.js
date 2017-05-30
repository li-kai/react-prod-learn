const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const parts = require('./webpack.parts');

const PATHS = require('../config/paths');

const SERVER_FILE_NAME = 'server.js';

module.exports = merge([
  {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: 'source-map',
    target: 'node',
    externals: nodeExternals(),
    entry: path.join(PATHS.src, SERVER_FILE_NAME),
    output: {
      path: PATHS.dist,
      filename: SERVER_FILE_NAME,
      library: 'commonjs2',
    },
    plugins: [
      // Silly webpack, environment variables aren't injected by default
      new webpack.EnvironmentPlugin(['NODE_ENV', 'BABEL_ENV']),
    ],
    node: {
      __dirname: false,
      __filename: false,
    },
  },
  parts.transpileJavascript({
    include: PATHS.src,
  }),
  parts.minifyJavascript(),
]);
