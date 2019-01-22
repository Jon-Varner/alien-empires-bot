import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import './AlienPhase.module.scss';

class AlienPhase extends Component {
  state = {
    instructions: ``
  };

  /* the game always uses a single 10-sided die */
  rollDie = () => {
    return Math.floor(Math.random() * Math.floor(11));
  };

  allocateCP = roll => {
    /* update this alien's CP in state */
  };

  render() {
    const turn = this.props.turn.turn;
    const aliens = this.props.opponents;
    const player = this.props.player;

    let totalRolls = 1;
    let econRoll = 0;
    let fleetRoll = 0;
    let currentRoll = 0;
    let launchModifier = 0;
    let raider = false;

    /* For each alien: */

    /*
      1. Do econ roll
    */
    currentRoll = this.rollDie();

    switch (turn) {
      case 1:
        if (currentRoll < 3) {
          /* alien.addRollOnTurn = 4 */
        } else {
          /* alien */
        }
      default:
    }
    /*
    2. Allocate CPs
    3. GOTO 1
    4. alien.fleetcp > 5 ? GOTO 6 : 
    6. player.fighters > 0 GOTO 7 : GOTO 10
    7. player.pointDefense < alien.fighters GOTO 8 : GOTO 10
    8. alien.fleetcp > 25 GOTO 9 : GOTO 10
    9. launchModifier+2 then GOTO 10
    10. player.cloaking > 0 ? GOTO 11 : GOTO 14
    11. player.scanners < alien.cloaking ? GOTO 12 : GOTO 14
    12. alien.fleetcp > 11 ? GOTO 13 : GOTO 14
    13. launchModifier+2 AND raider=true GOTO 14
    14. random roll within turn.fleetroll range - launchModifier
        ? success GOTO 15 : GOTO
    15. raider=true ? GOTO 17 : GOTO 16
    16. alien.fleets push alien.fleetcp then alien.fleetcp=0 then GOTO 18
    17. instructions += "Add X raiders" X = all affordable with alien.fleetcp then subtract alien.fleetcp then GOTO 18
    18. roll for move tech = success ? GOTO 19 : GOTO 20
    19. alien.techcp > required ? alien.movement+1 then subtract alien.techcp then GOTO 20
    20. ADVANCE

    */

    return <Aux>{this.state.instructions}</Aux>;
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
)(AlienPhase);
