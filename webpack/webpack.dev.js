const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');
const PATHS = require('../config/paths');

const commonConfig = require('./webpack.config');

const babelrcPath = path.join(PATHS.root, '.babelrc');
const babelConfig = JSON.parse(fs.readFileSync(babelrcPath));

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
  parts.transpileJavascript({
    include: PATHS.src,
    options: {
      babelrc: false,
      ...babelConfig,
      presets: [
        ['env', {
          targets: {
            browsers: ['>1%'],
          },
          modules: false,
        }],
        'react',
      ],
    },
  }),
]);
