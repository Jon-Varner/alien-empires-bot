import * as actionTypes from '../actions';

const initialState = {
  cpPerTurn: 5,
  aliens: [
    {
      id: 0,
      color: 'red',
      econRolls: 0,
      extraRollOnTurn: [1],
      fleetcp: 0,
      techcp: 0,
      defensecp: 0,
      movement: 1,
      pointDefense: 0,
      minesweeper: 0,
      scanners: 0,
      shipSize: 1,
      fighters: 0,
      cloaking: 0,
      attack: 0,
      defense: 0,
      tactics: 0,
      mines: 0,
      bases: 0,
      invaded: false,
      fleets: []
    },
    {
      id: 1,
      color: 'blue',
      econRolls: 0,
      extraRollOnTurn: [1],
      fleetcp: 0,
      techcp: 0,
      defensecp: 0,
      movement: 1,
      pointDefense: 0,
      minesweeper: 0,
      scanners: 0,
      shipSize: 1,
      fighters: 0,
      cloaking: 0,
      attack: 0,
      defense: 0,
      tactics: 0,
      mines: 0,
      bases: 0,
      invaded: false,
      fleets: []
    }
  ],
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
