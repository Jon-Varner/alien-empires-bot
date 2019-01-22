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
    const alien = this.props.opponents.find(
      opponent => opponent.id === event.target.id
    );

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
            {this.props.opponents.map((opponent, index) => {
              if (opponent.active) {
                return (
                  <li
                    key={index}
                    id={opponent.id}
                    onClick={this.fleetEncounteredHandler}
                  >
                    {opponent.color}
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
    opponents: state.opponents.opponents,
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
