import * as actionTypes from '../actions';

const initialState = {
  instructions: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INSTRUCTIONS:
      return {
        ...state,
        instructions: action.payload.instructions
      };
    default:
      return state;
  }
};

export default reducer;
