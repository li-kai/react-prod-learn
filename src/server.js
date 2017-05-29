import Express from 'express';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import HTMLDocument from './components/HTMLDocument';
// import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack/webpack.config';
import rootReducer from './reducers';
import App from './containers/App';

const app = Express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { serverSideRender: true }));
  // app.use(webpackHotMiddleware(compiler));
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
  const webpackAssets = res.locals.webpackStats.toJson();

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
app.use(handleRender);

// Finally, start the express server
const port = process.env.PORT || 3000;
app.listen(port, (error) => {
  if (!error) {
    console.log(port);
  }
});
