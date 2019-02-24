import { combineReducers } from 'redux';

import turnReducer from './turn';
import playerReducer from './player';
import aliensReducer from './aliens';
import instructionsReducer from './instructions';
import interfaceReducer from './interface';

export default combineReducers({
  turn: turnReducer,
  player: playerReducer,
  aliens: aliensReducer,
  instructions: instructionsReducer,
  interface: interfaceReducer
});
