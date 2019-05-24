import { SET_INSTRUCTIONS } from '../actions/types';

const initialState = {
  instructions: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INSTRUCTIONS:
      return {
        ...state,
        instructions: action.payload.instructions
      };
    default:
      return state;
  }
};

export default reducer;
