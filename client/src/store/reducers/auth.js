import { TEST_DISPATCH } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_DISPATCH:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default reducer;
