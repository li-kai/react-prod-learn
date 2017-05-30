import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

import parts from './webpack.parts';
import PATHS from '../config/paths';

module.exports = merge([
  {
    entry: path.join(PATHS.src, 'client.js'),
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
  parts.loadCSS({ include: PATHS.src, exclude: PATHS.styles, isCSSModules: true }),
  parts.loadCSS({ include: PATHS.styles, isCSSModules: false }),
]);
