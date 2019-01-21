import * as actionTypes from '../actions';

const initialState = {
  opponents: [
    {
      id: 'red',
      color: 'red',
      difficulty: 'easy',
      active: true,
      econrolls: 1,
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
      tactics: 0
    },
    {
      id: 'blue',
      color: 'blue',
      difficulty: 'easy',
      active: true,
      econrolls: 1,
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
      tactics: 0
    },
    {
      id: 'green',
      color: 'green',
      difficulty: 'easy',
      active: true,
      econrolls: 1,
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
      tactics: 0
    },
    {
      id: 'yellow',
      color: 'yellow',
      difficulty: 'easy',
      active: false,
      econrolls: 1,
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
      tactics: 0
    }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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

    case actionTypes.SET_DIFFICULTY:
      const difficultyOpponents = state.opponents.map(opponent => {
        if (opponent.id === action.payload.id) {
          return { ...opponent, difficulty: action.payload.value };
        }
        return opponent;
      });

      return {
        ...state,
        opponents: difficultyOpponents
      };

    default:
      return state;
  }
};

export default reducer;
