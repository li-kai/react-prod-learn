import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import rootReducer from './reducers';

import './styles/main.scss';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;  // eslint-disable-line no-underscore-dangle

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;  // eslint-disable-line no-underscore-dangle

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
