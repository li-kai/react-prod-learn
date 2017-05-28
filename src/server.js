import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack/webpack.config';
import rootReducer from './reducers';
import App from './containers/App';

const app = Express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler));
  // app.use(webpackHotMiddleware(compiler));
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}

function handleRender(req, res) {
  // Create a new Redux store instance
  const store = createStore(rootReducer);

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();

  // Send the rendered page back to the client
  res.send(renderFullPage(html, preloadedState));
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
