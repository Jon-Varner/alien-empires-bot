import * as actionTypes from '../actions';

const initialState = {
  turn: 0,
  phase: 'player'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_GAME:
      return {
        ...state,
        turn: 1
      };
    default:
      return state;
  }
};

export default reducer;
