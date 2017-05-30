const webpack = require('webpack');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');
const PATHS = require('../config/paths');

const commonConfig = require('./webpack.config');

module.exports = merge([commonConfig,
  {
    // Use a fast source map for good-enough debugging usage
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: PATHS.dist,
      filename: '[name].js',
    },
  },
]);
