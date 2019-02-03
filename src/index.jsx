import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import App from './App';
import turnReducer from './store/reducers/turn';
import playerReducer from './store/reducers/player';
import aliensReducer from './store/reducers/aliens';
import instructionsReducer from './store/reducers/instructions';
import interfaceReducer from './store/reducers/interface';

import './index.scss';

const rootReducer = combineReducers({
  turn: turnReducer,
  player: playerReducer,
  aliens: aliensReducer,
  instructions: instructionsReducer,
  interface: interfaceReducer
});

const store = createStore(rootReducer, devToolsEnhancer());

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
