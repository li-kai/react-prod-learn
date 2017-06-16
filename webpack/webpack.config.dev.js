const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge');

const PATHS = require('../config/paths');
const SUPPORTED_BROWSERS = require('../config/supportedBrowsers');

const parts = require('./webpack.parts');

const babelConfig = fs.readJSONSync(path.join(PATHS.root, '.babelrc'));

const commonConfig = merge([
  {
    // Use a fast source map for good-enough debugging usage
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
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
  parts.loadImages({ include: [PATHS.public, PATHS.src] }),
  parts.loadFonts({ include: [PATHS.public, PATHS.src] }),
  parts.loadCSS({ include: PATHS.src, exclude: PATHS.styles, isCSSModules: true }),
  parts.loadCSS({ include: PATHS.styles, isCSSModules: false }),
]);

const clientConfig = merge([commonConfig,
  {
    name: 'client',
    target: 'web',
    entry: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      path.join(PATHS.src, 'client.js'),
    ],
    output: {
      path: PATHS.dist,
      filename: '[name].js',
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
      new webpack.HotModuleReplacementPlugin(),
      // prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),
      // do not emit compiled assets that include errors
      new webpack.NoEmitOnErrorsPlugin(),
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
      plugins: ['react-hot-loader/babel'].concat(babelConfig.plugins),
    }),
  }),
]);

const serverConfig = merge([commonConfig,
  {
    name: 'server',
    target: 'node',
    entry: path.join(PATHS.src, 'server.js'),
    output: {
      path: PATHS.dist,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
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
