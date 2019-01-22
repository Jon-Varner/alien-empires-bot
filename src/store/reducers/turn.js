import * as actionTypes from '../actions';

const initialState = {
  turn: 0,
  phase: 'alien'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_GAME:
      return {
        ...state,
        turn: 1
      };
    case actionTypes.ADVANCE_PHASE:
      let phase = '';
      let turn = state.turn;

      if (state.phase === 'alien') {
        phase = 'player';
        turn = turn + 1;
      } else {
        phase = 'alien';
      }
      return {
        turn: turn,
        phase: phase
      };
    default:
      return state;
  }
};

export default reducer;
