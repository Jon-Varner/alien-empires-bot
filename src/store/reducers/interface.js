import * as actionTypes from '../actions';

const initialState = {
  footerClass: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_DRAWER:
      let footerClass = state.footerClass;

      if (footerClass === '') {
        footerClass = 'open';
      } else {
        footerClass = '';
      }
      return {
        ...state,
        footerClass: footerClass
      };
    default:
      return state;
  }
};

export default reducer;
