import path from 'path';
import fs from 'fs';
import merge from 'webpack-merge';

import parts from './webpack.parts';
import PATHS from '../config/paths';

import commonConfig from './webpack.config';
import SUPPORTED_BROWSERS from '../config/supportedBrowsers';

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
      presets: [  // Override presets to support browsers
        ['env', {
          targets: {
            browsers: SUPPORTED_BROWSERS,
          },
          modules: false,
        }],
        'react',
      ],
    },
  }),
]);
