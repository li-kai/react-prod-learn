const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const PATHS = require('../config/paths');
const SUPPORTED_BROWSERS = require('../config/supportedBrowsers');

const parts = require('./webpack.parts');

const babelConfig = fs.readJSONSync(path.join(PATHS.root, '.babelrc'));

const commonConfig = merge([
  {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    plugins: [
      new webpack.EnvironmentPlugin(['NODE_ENV', 'BABEL_ENV']),
    ],
  },
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
]);

const clientConfig = merge([commonConfig,
  {
    name: 'client',
    target: 'web',
    entry: path.join(PATHS.src, 'client.js'),
    output: {
      path: PATHS.dist,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          return module.context && module.context.indexOf('node_modules') !== -1;
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
      }),
    ],
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
  parts.extractCSS({ include: PATHS.src, exclude: PATHS.styles, isCSSModules: true }),
  parts.extractCSS({ include: PATHS.styles, isCSSModules: false }),
  parts.writeStats(),
]);

const serverConfig = merge([commonConfig,
  {
    name: 'server',
    target: 'node',
    entry: path.join(PATHS.src, 'server', 'index.js'),
    output: {
      path: PATHS.dist,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
    externals: nodeExternals(),
    node: {
      __dirname: true,
      __filename: true,
    },
  },
  parts.transpileJavascript({
    include: PATHS.src,
  }),
]);

module.exports = [clientConfig, serverConfig];
