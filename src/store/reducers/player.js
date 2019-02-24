import { UPDATE_PLAYER_TECH } from '../actions/types';

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
    case UPDATE_PLAYER_TECH:
      return {
        ...state,
        player: action.payload.player
      };
    default:
      return state;
  }
};

export default reducer;
