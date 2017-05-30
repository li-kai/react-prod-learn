const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');

const PATHS = require('../config/paths');
const SUPPORTED_BROWSERS = require('../config/supportedBrowsers');

const parts = require('./webpack.parts');
const commonConfig = require('./webpack.config');

const babelConfig = fs.readJSONSync(path.join(PATHS.root, '.babelrc'));

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
    options: Object.assign(babelConfig, {
      babelrc: false,
      presets: [  // Override presets to support browsers
        ['env', {
          targets: {
            browsers: SUPPORTED_BROWSERS,
          },
          modules: false,
        }],
        'react',
      ],
    }),
  }),
  parts.loadImages({ include: [PATHS.public, PATHS.src] }),
  parts.loadFonts({ include: [PATHS.public, PATHS.src] }),
  parts.loadCSS({ include: PATHS.src, exclude: PATHS.styles, isCSSModules: true }),
  parts.loadCSS({ include: PATHS.styles, isCSSModules: false }),
]);
