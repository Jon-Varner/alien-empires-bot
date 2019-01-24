import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import './AlienPhase.module.scss';

class AlienPhase extends Component {
  /* the game always uses a single 10-sided die */
  rollDie = () => {
    return Math.floor(Math.random() * Math.floor(11));
  };

  render() {
    const turn = this.props.turn;
    const player = this.props.player;
    const aliens = [...this.props.aliens];
    const cp = this.props.cpPerTurn;

    let instructions = ``;
    let fleetLaunchTarget = 0;
    let launchModifier = 0;
    let raider = false;
    let currentRoll = 0;

    /* For each alien: */
    for (let i = 0; i < aliens.length; i++) {
      const alien = aliens[i];

      /* Always add an econ roll on these turns */
      const addedRolls = [3, 6, 10, 15];
      if (addedRolls.includes(turn)) {
        alien.econRolls += 1;
      }

      /* See if an extra roll was added for this turn */
      if (alien.extraRollOnTurn.includes(turn)) {
        alien.econRolls += 1;
      }

      /* For each econ roll, allocate CPs according to the rules schedule */

      for (let i = 0; i < alien.econRolls; i++) {
        currentRoll = this.rollDie();

        switch (turn) {
          case 1:
            if (currentRoll < 3) {
              alien.extraRollOnTurn.push(4);
            } else {
              alien.techcp += cp;
            }
            break;
          case 2:
            if (currentRoll < 2) {
              alien.extraRollOnTurn.push(5);
            } else if (currentRoll < 4) {
              alien.fleetcp += cp;
            } else {
              alien.techcp += cp;
            }
            break;
          case 3:
            if (currentRoll < 2) {
              alien.extraRollOnTurn.push(6);
            } else if (currentRoll < 5) {
              alien.fleetcp += cp;
            } else if (currentRoll < 9) {
              alien.techcp += cp;
            } else {
              alien.defcp += cp;
            }
            break;
          case 4:
            if (currentRoll < 2) {
              alien.extraRollOnTurn.push(7);
            } else if (currentRoll < 6) {
              alien.fleetcp += cp;
            } else if (currentRoll < 9) {
              alien.techcp += cp;
            } else {
              alien.defcp += cp;
            }
            break;
          case 5:
            if (currentRoll < 2) {
              alien.extraRollOnTurn.push(8);
            } else if (currentRoll < 6) {
              alien.fleetcp += cp;
            } else if (currentRoll < 10) {
              alien.techcp += cp;
            } else {
              alien.defcp += cp;
            }
            break;
          case 6:
            if (currentRoll < 2) {
              alien.extraRollOnTurn.push(9);
            } else if (currentRoll < 7) {
              alien.fleetcp += cp;
            } else if (currentRoll < 10) {
              alien.techcp += cp;
            } else {
              alien.defcp += cp;
            }
            break;
          case 7:
          case 8:
          case 9:
            if (currentRoll < 6) {
              alien.fleetcp += cp;
            } else if (currentRoll < 10) {
              alien.techcp += cp;
            } else {
              alien.defcp += cp;
            }
            break;
          case 10:
          case 11:
          case 12:
            if (currentRoll < 7) {
              alien.fleetcp += cp;
            } else if (currentRoll < 10) {
              alien.techcp += cp;
            } else {
              alien.defcp += cp;
            }
            break;
          case 13:
          case 14:
            if (currentRoll < 7) {
              alien.fleetcp += cp;
            } else {
              alien.techcp += cp;
            }
            break;
          case 15:
          case 16:
            if (currentRoll < 8) {
              alien.fleetcp += cp;
            } else {
              alien.techcp += cp;
            }
            break;
          case 17:
          case 18:
            if (currentRoll < 9) {
              alien.fleetcp += cp;
            } else {
              alien.techcp += cp;
            }
            break;
          default:
            if (currentRoll < 10) {
              alien.fleetcp += cp;
            } else {
              alien.techcp += cp;
            }
        }
      }

      instructions = instructions + `CPs added for ${alien.color} alien.`;

      /* Don't attempt to launch a fleet unless the minimum CPs are available */

      if (alien.fleetcp > 5) {
      } else {
        instructions =
          instructions + `${alien.color} alien does not launch a fleet.`;
      }
      /*
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
    }

    console.log(aliens);
    return <Aux>{instructions}</Aux>;
  }
}

const mapStateToProps = state => {
  return {
    cpPerTurn: state.aliens.cpPerTurn,
    aliens: state.aliens.aliens,
    player: state.player.player,
    turn: state.turn.turn,
    phase: state.turn.phase
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateAlien: () => {
      dispatch({ type: actionTypes.UPDATE_ALIEN });
    },
    onProceed: () => {
      dispatch({ type: actionTypes.ADVANCE_PHASE });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlienPhase);
