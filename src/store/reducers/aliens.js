import * as actionTypes from '../actions';

const initialState = {
  cpPerTurn: 5,
  aliens: [{ id: 0, color: 'red' }, { id: 1, color: 'blue' }],
  currentAlien: {},
  currentFleet: {},
  fleetLaunched: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DIFFICULTY:
      return {
        ...state,
        cpPerTurn: action.payload.cpPerTurn,
        aliens: action.payload.aliens
      };
    case actionTypes.SET_FLEET_LAUNCHED:
      return {
        ...state,
        fleetLaunched: action.payload.fleetLaunched
      };
    case actionTypes.SET_CURRENT_ALIEN_AND_FLEET:
      return {
        ...state,
        currentAlien: action.payload.alien,
        currentFleet: action.payload.fleet
      };
    case actionTypes.UPDATE_ALIEN:
      return {
        ...state,
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
