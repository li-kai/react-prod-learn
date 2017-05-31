/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Helper utilities
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import chalk from 'chalk';

// Express server dependencies
import express from 'express';
import favicon from 'serve-favicon';

// React server dependencies
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Configuration paths
import PATHS from '../config/paths';

// React components
import rootReducer from './reducers';
import App from './App';
import HTMLDocument from './components/HTMLDocument';

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

let webpackStats;
if (IS_DEV_ENV) { /* eslint-disable global-require */
  // Run Webpack dev server in development mode
  const webpackConfig = require('../webpack/webpack.dev');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  server.use(webpackDevMiddleware(compiler, {
    serverSideRender: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      chunks: false,
    },
  }));
  // app.use(webpackHotMiddleware(compiler));
} else {  /* eslint-disable global-require */
  webpackStats = fs.readJSONSync(path.join(PATHS.dist, 'stats.json'));
}

function handleRender(req, res) {
  // Create a new Redux store instance
  const store = createStore(rootReducer);

  // Render the component to a string
  const componentMarkUp = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();

  if (IS_DEV_ENV) { // Get webpack stats from dev-middleware
    webpackStats = res.locals.webpackStats.toJson();
  }

  const html = renderToStaticMarkup(
    <HTMLDocument
      state={preloadedState}
      markup={componentMarkUp}
      webpackAssets={webpackStats.assetsByChunkName}
    />,
  );

  // Send the rendered page back to the client
  res.send(`<!DOCTYPE html>${html}`);
}

// Serves faviconss
server.use(favicon(path.join(PATHS.assets, 'favicons', 'favicon.ico')));

server.use(express.static(PATHS.assets, {
  maxAge: 365 * 24 * 60 * 60,
}));

// This is fired every time the server side receives a request
server.use(handleRender);

// Finally, start the express server
server.listen(PORT, () => {
  const url = `${PROTOCOL}://${HOST}:${PORT}/`;
  console.log(`Server started at ${chalk.cyan(url)}`);
  if (IS_DEV_ENV) {
    const openBrowser = require('react-dev-utils/openBrowser');
    openBrowser(url);
  }
});
