import path from 'path';
import dotenv from 'dotenv';
import Express from 'express';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import PATHS from '../config/paths';

import rootReducer from './reducers';
import App from './App';
import HTMLDocument from './components/HTMLDocument';

dotenv.config({ path: path.join(PATHS.root, '.env.development') });
const IS_DEV_ENV = process.env.NODE_ENV === 'development';

const server = Express();

let webpackAssets;
if (IS_DEV_ENV) { /* eslint-disable global-require, import/no-extraneous-dependencies */
  // Run Webpack dev server in development mode
  const webpackConfig = require('../webpack/webpack.config');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  server.use(webpackDevMiddleware(compiler, { serverSideRender: true }));
  // app.use(webpackHotMiddleware(compiler));
} else {  /* eslint-disable global-require, import/no-extraneous-dependencies */
  // webpackAssets = require('./wesbpack-stats.json');
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
  if (IS_DEV_ENV) {
    webpackAssets = res.locals.webpackStats.toJson().assetsByChunkName;
  }

  const html = renderToStaticMarkup(
    <HTMLDocument
      state={preloadedState}
      markup={componentMarkUp}
      webpackAssets={webpackAssets}
    />,
  );

  // Send the rendered page back to the client
  res.send(`<!DOCTYPE html>${html}`);
}

// This is fired every time the server side receives a request
server.use(handleRender);

// Finally, start the express server
const port = process.env.PORT;
server.listen(port, (error) => {
  if (!error) {
    console.log(`Server started at port ${port}`);
  }
});
