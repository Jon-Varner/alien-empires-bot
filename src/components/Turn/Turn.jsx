import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import PlayerPhase from '../PlayerPhase/PlayerPhase';
import AlienPhase from '../AlienPhase/AlienPhase';

// import * as actionTypes from '../../store/actions';

import './Turn.module.scss';

class Turn extends Component {
  /* 
    FIRST: Ask Player if Fleet encountered (skip first turn)

    IF YES: Ask Player for current tech levels

            Calculate Alien Fleet
            Display results

    SECOND: Calculate alien techs
    */

  render() {
    let phase;

    if (this.props.turn.turn === 1) {
      phase = <AlienPhase />;
    } else {
      phase = <PlayerPhase />;
    }

    return <Aux>{phase}</Aux>;
  }
}

const mapStateToProps = state => {
  return {
    turn: state.turn.turn,
    player: state.player.player,
    opponents: state.opponents.opponents
  };
};

export default connect(mapStateToProps)(Turn);
