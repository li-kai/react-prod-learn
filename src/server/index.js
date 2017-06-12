/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Helper utilities
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import chalk from 'chalk';

// Express server dependencies
import express from 'express';
import favicon from 'serve-favicon';

// Configuration paths
import PATHS from '../../config/paths';

// Import environment variables
dotenv.config();

// If you use Docker, Vagrant or Cloud9, set
// host: options.host || '0.0.0.0';
//
// 0.0.0.0 is available to all network devices
// unlike default `localhost`.
const PORT = parseInt(process.env.PORT, 10) || 8080;
const HOST = process.env.HOST || 'localhost';
const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http';
const IS_DEV_ENV = process.env.NODE_ENV === 'development';

const server = express();

// Serves favicons
server.use(favicon(path.join(PATHS.public, 'favicons', 'favicon.ico')));

// On production, public directory is served by cloudfront as we configured in the ASSETS_ROOT_URL
// On development, public directory is a middleware for other requests not served by webpack
server.use(express.static(PATHS.dist, {
  maxAge: 365 * 24 * 60 * 60,
}));

// This is fired every time the server side receives a request
if (IS_DEV_ENV) { /* eslint-disable global-require */
  // Run Webpack dev server in development mode
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  const webpackConfig = require('../../webpack/webpack.config.dev');
  const compiler = webpack(webpackConfig);
  server.use(webpackDevMiddleware(compiler, {
    stats: {
      colors: true,
      hash: false,
      version: false,
      chunks: false,
    },
  }));
  server.use(webpackHotMiddleware(compiler.compilers.find(subCompiler => subCompiler.name === 'client')));
  server.use(webpackHotServerMiddleware(compiler));
} else {  /* eslint-disable global-require */
  const serverRenderer = require('../server');
  const webpackStats = fs.readJSONSync(path.join(PATHS.dist, 'stats.json'));
  server.use(serverRenderer(webpackStats));
}

// Finally, start the express server
server.listen(PORT, () => {
  const url = `${PROTOCOL}://${HOST}:${PORT}/`;
  console.log(`Server started at ${chalk.cyan(url)}`);
  if (IS_DEV_ENV) {
    const openBrowser = require('react-dev-utils/openBrowser');
    openBrowser(url);
  }
});
