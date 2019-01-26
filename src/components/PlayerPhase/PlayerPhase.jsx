import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import classes from './PlayerPhase.module.scss';

class PlayerPhase extends Component {
  state = {
    instructions: []
  };

  getAlienClass = color => {
    switch (color) {
      case 'red':
        return classes.red;
      case 'blue':
        return classes.blue;
      case 'green':
        return classes.green;
      case 'yellow':
        return classes.yellow;
      default:
        return classes.red;
    }
  };

  fleetEncounteredHandler = event => {
    const alien = this.props.aliens.find(alien => alien.id === event.target.id);

    this.setState({ instructions: `Encountered the ` + alien.id + ` fleet.` });
  };

  proceedHandler = () => {
    this.props.onProceed();
  };
  render() {
    let step;

    if (this.state.instructions.length === 0) {
      step = (
        <Aux>
          <p>Did you encounter an alien fleet?</p>
          <ul>
            {this.props.aliens.map((alien, index) => {
              const alienClass = this.getAlienClass(alien.color);

              return (
                <li
                  key={index}
                  id={alien.id}
                  onClick={this.fleetEncounteredHandler}
                  className={alienClass}
                >
                  {alien.color}
                </li>
              );
            })}
            <li className={classes.no} onClick={this.proceedHandler}>
              No
            </li>
          </ul>
        </Aux>
      );
    } else {
      /* 
        1. Calculate fleet
        2. Print instructions
        */
      step = (
        <button onClick={this.proceedHandler}>Proceed to Econ Phase</button>
      );
    }

    return (
      <div className={classes.instructions}>
        {step}
        <p>{this.state.instructions}</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    aliens: state.aliens.aliens,
    player: state.player.player,
    turn: state.turn.turn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProceed: () => {
      dispatch({ type: actionTypes.ADVANCE_PHASE });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerPhase);
