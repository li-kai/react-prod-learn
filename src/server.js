import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// React components
import rootReducer from './reducers';
import Template from './server/template';
import App from './App';

export default function serverRenderer({ clientStats, serverStats }) {
  return (req, res, next) => {
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

    const html = renderToStaticMarkup(
      <Template
        state={preloadedState}
        markup={componentMarkUp}
        webpackAssets={clientStats.assetsByChunkName}
      />,
    );

    // Send the rendered page back to the client
    res.send(`<!DOCTYPE html>${html}`);
  };
}
