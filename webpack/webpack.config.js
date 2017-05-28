const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');
const PATHS = require('../config/paths');

require('dotenv').config({ path: path.join(PATHS.root, '.env.development') });

module.exports = merge([
  {
    entry: path.join(PATHS.src, 'client.js'),
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
      // Ignore node_modules so CPU usage with poll
      // watching drops significantly.
      new webpack.WatchIgnorePlugin([
        PATHS.node_modules,
      ]),
    ],
  },
  parts.loadCSS({ include: PATHS.src, exclude: PATHS.styles, isCSSModules: true }),
  parts.loadCSS({ include: PATHS.styles, isCSSModules: false }),
]);
