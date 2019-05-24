import { TOGGLE } from '../actions/types';

const initialState = {
  footerClass: '',
  menuClass: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE:
      const target = action.payload.target;
      let targetClass = '';

      if (target === 'footer') {
        targetClass = state.footerClass;
        if (targetClass === '') {
          targetClass = 'open';
        } else {
          targetClass = '';
        }
        return {
          ...state,
          footerClass: targetClass
        };
      } else {
        targetClass = state.menuClass;
        if (targetClass === '') {
          targetClass = 'open';
        } else {
          targetClass = '';
        }
        return {
          ...state,
          menuClass: targetClass
        };
      }
    default:
      return state;
  }
};

export default reducer;
