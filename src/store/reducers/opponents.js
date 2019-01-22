import * as actionTypes from '../actions';

const initialState = {
  cpPerTurn: 5,
  opponents: [
    {
      color: 'red',
      econRolls: 1,
      addRollOnTurn: 0,
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
      fleets: []
    },
    {
      color: 'blue',
      econRolls: 1,
      addRollOnTurn: 0,
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
      fleets: []
    },
    {
      color: 'green',
      econRolls: 1,
      addRollOnTurn: 0,
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
      fleets: []
    },
    {
      color: 'yellow',
      econRolls: 1,
      addRollOnTurn: 0,
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
      fleets: []
    }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DIFFICULTY:
      return {
        ...state,
        cpPerTurn: action.payload.cpPerTurn
        /*
        Create full opponent for each in payload
        opponents: action.payload.opponents
        */
      };

    case actionTypes.SET_ACTIVE:
      const activeOpponents = state.opponents.map(opponent => {
        if (opponent.id === action.payload.id) {
          return { ...opponent, active: action.payload.value };
        }
        return opponent;
      });

      return {
        ...state,
        opponents: activeOpponents
      };

    case actionTypes.SET_ECONOMY:
      const econOpponents = state.opponents.map(opponent => {
        if (opponent.id === action.payload.id) {
          return action.payload.value;
        }
        return opponent;
      });

      return {
        ...state,
        opponents: econOpponents
      };
    default:
      return state;
  }
};

export default reducer;
