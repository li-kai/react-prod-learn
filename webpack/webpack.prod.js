const fs = require('fs-extra');
const path = require('path');
const merge = require('webpack-merge');

const PATHS = require('../config/paths');
const SUPPORTED_BROWSERS = require('../config/supportedBrowsers');

const commonConfig = require('./webpack.config');
const parts = require('./webpack.parts');

const babelConfig = fs.readJSONSync(path.join(PATHS.root, '.babelrc'));

module.exports = merge([commonConfig,
  {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: 'source-map',
    output: {
      path: PATHS.dist,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
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
  parts.minifyJavascript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true,
    },
  }),
  // If the file size is below the specified limit
  // the file is converted into a data URL and inlined to avoid requests.
  parts.loadImages({
    include: PATHS.public,
    options: {
      limit: 15000,
      name: '[name].[contenthash].[ext]',
    },
  }),
  parts.loadFonts({ include: PATHS.public }),
  parts.extractCSS({ include: PATHS.src, exclude: PATHS.styles, isCSSModules: true }),
  parts.extractCSS({ include: PATHS.styles, isCSSModules: false }),
]);
