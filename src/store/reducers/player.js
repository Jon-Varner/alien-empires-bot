//import * as actionTypes from '../actions';

const initialState = {
  player: {
    fighters: 0,
    pointDefense: 0,
    scanners: 0,
    cloaking: 0,
    mines: 0,
    raiders: 0
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
