import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import turnReducer from './store/reducers/turn';
import playerReducer from './store/reducers/player';
import aliensReducer from './store/reducers/aliens';

import './index.scss';

const rootReducer = combineReducers({
  turn: turnReducer,
  player: playerReducer,
  aliens: aliensReducer
});

const store = createStore(rootReducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
