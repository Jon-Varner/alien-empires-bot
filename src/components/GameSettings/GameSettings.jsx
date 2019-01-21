import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import classes from './GameSettings.module.scss';

class GameSettings extends Component {
  state = {
    errorMessage: ''
  };

  activeChangeHandler = event => {
    const newValue = event.target.checked ? true : false;

    this.props.onSetOpponentActive({
      id: event.target.parentNode.id,
      value: newValue
    });
  };

  difficultyChangeHandler = event => {
    this.props.onSetOpponentDifficulty({
      id: event.target.parentNode.id,
      value: event.target.value
    });
  };

  startHandler = () => {
    this.props.onStart();
  };

  render() {
    return (
      <Aux>
        <ul>
          {this.props.opponents.map((opponent, index) => (
            <li classes={classes.opponent} key={index} id={opponent.id}>
              <span classes={classes.color}>{opponent.color}</span>
              <select
                classes={classes.difficulty}
                value={opponent.difficulty}
                onChange={this.difficultyChangeHandler}
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
                <option value="harder">Harder</option>
                <option value="tough">Really Tough</option>
                <option value="impossible">Good Luck!</option>
              </select>
              <input
                type="checkbox"
                checked={opponent.active}
                classes={classes.chooser}
                onChange={this.activeChangeHandler}
              />
            </li>
          ))}
        </ul>
        <button onClick={this.startHandler}>PLAY!</button>
        <div classes={classes.errorMessage}>{this.state.errorMessage}</div>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    opponents: state.opponents.opponents,
    turn: state.turn.turn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetOpponentActive: payload => {
      dispatch({
        type: actionTypes.SET_ACTIVE,
        payload: payload
      });
    },
    onSetOpponentDifficulty: payload => {
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
  mapStateToProps,
  mapDispatchToProps
)(GameSettings);
