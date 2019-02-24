import { START_GAME, ADVANCE_PHASE, ADVANCE_STEP } from '../actions/types';

const initialState = {
  turn: 0,
  phase: 'alien',
  step: 'check for fleets'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        turn: 1
      };
    case ADVANCE_PHASE:
      let phase = '';
      let turn = state.turn;

      if (state.phase === 'alien') {
        phase = 'player';
        turn = turn + 1;
      } else {
        phase = 'alien';
      }
      return {
        ...state,
        turn: turn,
        phase: phase
      };
    case ADVANCE_STEP:
      return {
        ...state,
        step: action.payload.step
      };
    default:
      return state;
  }
};

export default reducer;
