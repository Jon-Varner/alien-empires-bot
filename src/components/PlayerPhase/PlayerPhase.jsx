import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import './PlayerPhase.module.scss';

class PlayerPhase extends Component {
  state = {
    instructions: ``
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

    if (this.state.instructions === '') {
      step = (
        <Aux>
          <p>Did you encounter an alien fleet?</p>
          <ul>
            {this.props.aliens.map((alien, index) => {
              if (alien.active) {
                return (
                  <li
                    key={index}
                    id={alien.id}
                    onClick={this.fleetEncounteredHandler}
                  >
                    {alien.color}
                  </li>
                );
              }
              return '';
            })}
            <li onClick={this.proceedHandler}>No</li>
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
      <Aux>
        {step}
        <p>{this.state.instructions}</p>
      </Aux>
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
