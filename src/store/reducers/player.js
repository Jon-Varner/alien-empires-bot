import * as actionTypes from '../actions';

const initialState = {
  player: {
    fighters: 0,
    pointDefense: 0,
    scanners: 0,
    cloaking: 0,
    mines: 0
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_PLAYER_TECH:
      return {
        ...state,
        player: action.payload.player
      };
    default:
      return state;
  }
};

export default reducer;
