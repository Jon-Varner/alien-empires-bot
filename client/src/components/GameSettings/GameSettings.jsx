import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import * as actionTypes from '../../store/actions/types';

import classes from './GameSettings.module.scss';

class GameSettings extends Component {
  createAliens = count => {
    const aliens = [];

    for (let i = 0; i < count; i++) {
      let color = this.getUniqueColor(i);
      aliens.push({
        id: i,
        color: color,
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
        fleets: []
      });
    }

    return aliens;
  };

  getAlienCount = difficulty => {
    switch (difficulty) {
      case 'easy':
      case 'hard':
      case 'tough':
        return 2;
      default:
        return 3;
    }
  };

  getCPperTurn = difficulty => {
    switch (difficulty) {
      case 'hard':
      case 'harder':
        return 10;
      case 'tough':
      case 'impossible':
        return 15;
      default:
        return 5;
    }
  };

  getUniqueColor = i => {
    switch (i) {
      case 0:
        return 'red';
      case 1:
        return 'blue';
      case 2:
        return 'green';
      case 3:
        return 'yellow';
      default:
        return 'red';
    }
  };

  onColorChange = event => {
    /* Ensure each alien has a unique color */
    const thisColor = event.target.value;
    const thisId = parseInt(event.target.id);
    const aliens = [...this.props.aliens];

    const duplicate = aliens.find(alien => alien.color === thisColor);

    if (duplicate) {
      /* Display error? */
    } else {
      const alien = aliens.find(alien => alien.id === thisId);
      alien.color = thisColor;

      this.props.updateAliens({
        aliens: aliens
      });
    }
  };

  onDifficultyChange = event => {
    let difficulty = event.target.value;

    /* Set number of aliens and set CP per turn */
    const aliens = this.createAliens(this.getAlienCount(difficulty));
    const cp = this.getCPperTurn(difficulty);

    this.props.setDifficulty({
      cpPerTurn: cp,
      aliens: aliens
    });
  };

  onStart = () => {
    /* Add all the extra empty properties */

    this.props.startGame();
  };

  render() {
    const aliens = [...this.props.aliens];

    return (
      <div className={classes.settings}>
        <label htmlFor="difficultySelector">Difficulty:</label>
        <select
          id="difficultySelector"
          className={classes.difficultySelector}
          onChange={this.onDifficultyChange}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="harder">Harder</option>
          <option value="tough">Really Tough</option>
          <option value="impossible">Good Luck!</option>
        </select>

        <label>Alien Empire colors:</label>
        <ul>
          {aliens.map(alien => {
            return (
              <li className={classes.alien} key={uuid.v4()}>
                <select
                  id={alien.id}
                  value={alien.color}
                  className={classes.colorSelector}
                  onChange={this.onColorChange}
                >
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                </select>
              </li>
            );
          })}
        </ul>
        <button className="advance" onClick={this.onStart}>
          PLAY
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cpPerTurn: state.aliens.cpPerTurn,
    aliens: state.aliens.aliens
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateAliens: ({ aliens }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
    },

    setDifficulty: ({ cpPerTurn, aliens }) => {
      dispatch({
        type: actionTypes.SET_DIFFICULTY,
        payload: {
          cpPerTurn: cpPerTurn,
          aliens: aliens
        }
      });
    },

    startGame: () => {
      dispatch({
        type: actionTypes.START_GAME
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameSettings);
