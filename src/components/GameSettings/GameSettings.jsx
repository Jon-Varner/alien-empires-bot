import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';

import classes from './GameSettings.module.scss';

class GameSettings extends Component {
  state = {
    cpPerTurn: 5,
    aliens: [{ id: 0, color: 'red' }, { id: 1, color: 'blue' }]
  };

  createAliens = count => {
    const aliens = [];

    for (let i = 0; i < count; i++) {
      let color = this.getUniqueColor(i);
      aliens.push({ id: i, color: color });
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

  colorChangeHandler = event => {
    /* Ensure each alien has a unique color */
    const thisColor = event.target.value;
    const thisId = parseInt(event.target.id);

    const duplicate = this.state.aliens.find(
      alien => alien.color === thisColor
    );

    if (duplicate) {
      /* Display error? */
    } else {
      const aliens = [...this.state.aliens];
      const alien = aliens.find(alien => alien.id === thisId);
      alien.color = thisColor;

      this.setState({
        aliens: aliens
      });
    }
  };

  difficultyChangeHandler = event => {
    let difficulty = event.target.value;

    /* Set number of aliens and set CP per turn */
    const aliens = this.createAliens(this.getAlienCount(difficulty));

    const cp = this.getCPperTurn(difficulty);

    this.setState({
      cpPerTurn: cp,
      aliens: aliens
    });
  };

  startHandler = () => {
    /* Add all the extra empty properties */

    const aliens = this.state.aliens.map(alien => ({
      ...alien,
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
      exploration: 0,
      fleets: []
    }));

    this.props.onSetDifficulty({
      cpPerTurn: this.state.cpPerTurn,
      aliens: aliens
    });
  };

  render() {
    return (
      <div className={classes.settings}>
        <label htmlFor="difficultySelector">Difficulty:</label>
        <select
          id="difficultySelector"
          className={classes.difficultySelector}
          onChange={this.difficultyChangeHandler}
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
          {this.state.aliens.map((alien, index) => {
            return (
              <li className={classes.alien} key={index}>
                <select
                  id={alien.id}
                  value={alien.color}
                  className={classes.colorSelector}
                  onChange={this.colorChangeHandler}
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
        <button onClick={this.startHandler}>PLAY</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetDifficulty: payload => {
      dispatch({
        type: actionTypes.SET_DIFFICULTY,
        payload: payload
      });

      dispatch({
        type: actionTypes.START_GAME
      });
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(GameSettings);
