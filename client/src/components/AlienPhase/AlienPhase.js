import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { calculateAlienEconomy } from '../../utils/economy';
import Instructions from '../Messages/Instructions';

import * as actionTypes from '../../store/actions/types';

class AlienPhase extends Component {
  componentDidMount() {
    const economy = calculateAlienEconomy(
      this.props.turn,
      this.props.player,
      [...this.props.aliens],
      this.props.cpPerTurn
    );

    this.props.updateAliensAndSetInstructions({
      aliens: economy.aliens,
      step: economy.step,
      instructions: economy.instructions
    });
  }

  onAdvance = () => {
    const fleetLaunched = this.props.fleetLaunched;
    let step = this.props.step;

    if (fleetLaunched) {
      step = 'fleet encounters';
    }

    this.props.advance({
      step: step
    });
  };

  render() {
    const instructions = [...this.props.instructions];

    return (
      <Fragment>
        <Instructions instructions={instructions} />
        <button className="advance" onClick={this.onAdvance}>
          END TURN
        </button>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    cpPerTurn: state.aliens.cpPerTurn,
    aliens: state.aliens.aliens,
    player: state.player.player,
    turn: state.turn.turn,
    step: state.turn.step,
    instructions: state.instructions.instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateAliensAndSetInstructions: ({ aliens, step, instructions }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
      dispatch({
        type: actionTypes.ADVANCE_STEP,
        payload: {
          step: step
        }
      });
      dispatch({
        type: actionTypes.SET_INSTRUCTIONS,
        payload: {
          instructions: instructions
        }
      });
    },
    advance: ({ step }) => {
      dispatch({
        type: actionTypes.ADVANCE_STEP,
        payload: {
          step: step
        }
      });
      dispatch({
        type: actionTypes.ADVANCE_PHASE
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlienPhase);
