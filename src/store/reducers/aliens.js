import * as actionTypes from '../actions';

const initialState = {
  cpPerTurn: 5,
  aliens: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DIFFICULTY:
      return {
        ...state,
        cpPerTurn: action.payload.cpPerTurn,
        aliens: action.payload.aliens
      };

    case actionTypes.UPDATE_ALIENS:
      return {
        ...state,
        aliens: action.payload.aliens
      };
    default:
      return state;
  }
};

export default reducer;
