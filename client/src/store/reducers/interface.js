import { TOGGLE_DRAWER } from '../actions/types';

const initialState = {
  footerClass: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
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
