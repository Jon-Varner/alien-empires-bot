import { TEST_DISPATCH } from '../actions/types';

export const registerUser = userData => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  };
};
