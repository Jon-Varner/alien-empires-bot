import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import turnReducer from './store/reducers/turn';
import playerReducer from './store/reducers/player';
import opponentsReducer from './store/reducers/opponents';

import './index.scss';

const rootReducer = combineReducers({
  turn: turnReducer,
  player: playerReducer,
  opponents: opponentsReducer
});

const store = createStore(rootReducer);
const rootElement = document.getElementById('root');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
