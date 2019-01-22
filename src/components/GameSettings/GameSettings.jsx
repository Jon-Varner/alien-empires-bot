import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import classes from './GameSettings.module.scss';

class GameSettings extends Component {
  state = {
    cpPerTurn: 5,
    opponents: [{ id: 0, color: 'red' }, { id: 1, color: 'blue' }],
    errorMessage: ''
  };

  createOpponents = count => {
    const opponents = [];

    for (let i = 0; i < count; i++) {
      let color = this.getUniqueColor(i);
      console.log(i + ' : ' + color);
      opponents.push({ id: i, color: color });
    }

    return opponents;
  };

  getOpponentCount = difficulty => {
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
    /* Ensure each opponent has a unique color */
    const thisColor = event.target.value;
    const thisId = parseInt(event.target.id);

    const duplicate = this.state.opponents.find(
      opponent => opponent.color === thisColor
    );

    if (duplicate) {
      this.setState({
        errorMessage: 'Alien Empires must be different colors.'
      });
    } else {
      const opponents = [...this.state.opponents];
      const alien = opponents.find(opponent => opponent.id === thisId);
      alien.color = thisColor;

      this.setState({
        opponents: opponents,
        errorMessage: ''
      });
    }
  };

  difficultyChangeHandler = event => {
    let difficulty = event.target.value;

    /* Set number of opponents and set CP per turn */
    const opponents = this.createOpponents(this.getOpponentCount(difficulty));

    const cp = this.getCPperTurn(difficulty);

    this.setState({
      cpPerTurn: cp,
      opponents: opponents,
      errorMessage: ''
    });

    //this.props.onSetDifficulty(cp);
  };

  startHandler = () => {
    this.props.onStart();
  };

  render() {
    return (
      <Aux>
        <select
          classes={classes.difficulty}
          onChange={this.difficultyChangeHandler}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="harder">Harder</option>
          <option value="tough">Really Tough</option>
          <option value="impossible">Good Luck!</option>
        </select>
        <ul>
          {this.state.opponents.map((opponent, index) => {
            return (
              <li classes={classes.opponent} key={index}>
                <select
                  id={opponent.id}
                  value={opponent.color}
                  classes={classes.color}
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
        <button onClick={this.startHandler}>PLAY!</button>
        <div classes={classes.errorMessage}>{this.state.errorMessage}</div>
      </Aux>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetOpponentActive: payload => {
      dispatch({
        type: actionTypes.SET_ACTIVE,
        payload: payload
      });
    },
    onSetDifficulty: payload => {
      dispatch({
        type: actionTypes.SET_DIFFICULTY,
        payload: payload
      });
    },
    onStart: () => {
      dispatch({ type: actionTypes.START_GAME });
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(GameSettings);
