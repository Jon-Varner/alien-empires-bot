import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

const saveAndLoad = props => (
  <Fragment>
    <p>Load a game:</p>
    <ul>
      {props.games.map(game => (
        <li key={uuid.v4()}>
          <button
            onClick={() => {
              props.loadGame(game.id);
            }}
          >
            {game.dateTime} : {game.difficulty}
          </button>
        </li>
      ))}

      <li>
        <button
          className="advance"
          onClick={() => {
            props.saveGame();
          }}
        >
          Save current game
        </button>
      </li>
    </ul>
  </Fragment>
);

saveAndLoad.propTypes = {
  games: PropTypes.array,
  loadGame: PropTypes.func.isRequired,
  saveGame: PropTypes.func.isRequired
};

export default saveAndLoad;
