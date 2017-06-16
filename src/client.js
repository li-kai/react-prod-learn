import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import rootReducer from './reducers';

import './styles/main.scss';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;  // eslint-disable-line no-underscore-dangle

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;  // eslint-disable-line no-underscore-dangle

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState);

const rootEl = document.getElementById('root');
function renderToRoot(Component) {
  return render(
    <AppContainer>
      {Component}
    </AppContainer>,
    rootEl,
  );
}

renderToRoot(
  <Provider store={store}>
    <App />
  </Provider>,
);

if (module.hot) {
  module.hot.accept('./App', () => renderToRoot(
    <Provider store={store}>
      <App />
    </Provider>,
  ));
}
