import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Instructions from '../../components/Instructions/Instructions';

import * as actionTypes from '../../store/actions';

class AlienPhase extends Component {
  /* the game always uses a single 10-sided die */
  rollDie = () => {
    return Math.floor(Math.random() * Math.floor(11));
  };

  getInstructions = (turn, player, aliens, cp) => {
    let instructions = [];
    let fleetLaunchTarget = 0;
    let launchModifier = 0;
    let fleetLaunched = false;
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

      /* Don't attempt to launch a fleet unless the minimum CPs are available */

      if (alien.fleetcp > 5) {
        if (
          player.fighters > 0 &&
          player.pointDefense > alien.fighters &&
          alien.fleetcp > 24
        ) {
          launchModifier = 2;
        }

        if (
          alien.cloaking > 0 &&
          player.scanners < alien.cloaking &&
          alien.fleetcp > 11
        ) {
          launchModifier += 2;
          raider = true;
        }

        /* Find the target roll based on the current turn # */
        switch (turn) {
          case 2:
          case 3:
          case 14:
          case 16:
          case 18:
          case 20:
            fleetLaunchTarget = 10;
            break;
          case 4:
          case 9:
          case 10:
            fleetLaunchTarget = 5;
            break;
          case 5:
          case 11:
          case 12:
          case 13:
          case 15:
          case 17:
          case 19:
            fleetLaunchTarget = 3;
            break;
          case 6:
          case 7:
          case 8:
            fleetLaunchTarget = 4;
            break;
          default:
            fleetLaunchTarget = 0;
        }

        /* Subtract roll modifier */

        currentRoll = this.rollDie();
        currentRoll -= launchModifier;

        if (currentRoll <= fleetLaunchTarget) {
          /* Build a fleet of all affordable raiders or make the fleet's CP for later */

          const fleetID = alien.fleets.length + 1;

          if (raider) {
            let targetRaiders = Math.floor(alien.fleetcp / 12);
            let actualRaiders = 0;

            while (alien.fleetcp > 11 && targetRaiders > 0) {
              actualRaiders += 1;
              targetRaiders -= 1;
              alien.fleetcp -= 12;
            }

            alien.fleets.push({
              id: fleetID,
              cp: 0,
              encountered: false,
              raiders: actualRaiders
            });

            instructions.push(
              <li>
                <span className={alien.color}>{alien.color}</span> alien
                launches Fleet #{fleetID} of {actualRaiders} raiders.
              </li>
            );
          } else {
            alien.fleets.push({
              id: fleetID,
              cp: alien.fleetcp,
              encountered: false,
              raiders: 0,
              scouts: 0,
              destroyers: 0,
              cruisers: 0,
              battlecruisers: 0,
              battleships: 0,
              dreadnaughts: 0,
              carriers: 0,
              fighters: 0
            });

            alien.fleetcp = 0;

            instructions.push(
              <li>
                <span className={alien.color}>{alien.color}</span> alien
                launches Fleet #{fleetID}.
              </li>
            );
          }
          fleetLaunched = true;
        } else {
          instructions.push(
            <li>
              <span className={alien.color}>{alien.color}</span> alien does not
              launch a fleet.
            </li>
          );
        }
      } else {
        instructions.push(
          <li>
            <span className={alien.color}>{alien.color}</span> alien does not
            launch a fleet.
          </li>
        );
      }

      /* See if the alien will research movement tech */
      if (fleetLaunched) {
        if (alien.movement < 7) {
          currentRoll = this.rollDie();

          if (currentRoll < 5) {
            let targetMoveCP = 0;

            if (
              alien.movement === 1 ||
              alien.movement === 5 ||
              alien.movement === 6
            ) {
              targetMoveCP = 20;
            } else {
              targetMoveCP = 25;
            }

            if (alien.techcp > targetMoveCP) {
              alien.movement += 1;
              alien.techcp -= targetMoveCP;
            }
          }
        }
      }
    }

    this.props.updateAliens({
      aliens: aliens,
      fleetLaunched: fleetLaunched
    });

    return instructions;
  };

  advanceHandler = () => {
    const fleetLaunched = this.props.fleetLaunched;
    let step = this.props.step;

    if (fleetLaunched) {
      step = 'fleet encounters';
    }

    this.props.advance({
      step: step
    });
  };

  componentDidMount() {
    const instructions = this.getInstructions(
      this.props.turn,
      this.props.player,
      [...this.props.aliens],
      this.props.cpPerTurn
    );

    this.props.setInstructions({ instructions: instructions });
  }

  render() {
    const instructions = [...this.props.instructions];

    return (
      <Aux>
        <Instructions instructions={instructions} />
        <button className="advance" onClick={this.advanceHandler}>
          END TURN
        </button>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    cpPerTurn: state.aliens.cpPerTurn,
    aliens: state.aliens.aliens,
    fleetLaunched: state.aliens.fleetLaunched,
    player: state.player.player,
    turn: state.turn.turn,
    step: state.turn.step,
    instructions: state.instructions.instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateAliens: ({ aliens, fleetLaunched }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
      dispatch({
        type: actionTypes.SET_FLEET_LAUNCHED,
        payload: {
          fleetLaunched: fleetLaunched
        }
      });
    },
    setFleetLaunched: ({ fleetLaunched }) => {
      dispatch({
        type: actionTypes.SET_FLEET_LAUNCHED,
        payload: {
          fleetLaunched: fleetLaunched
        }
      });
    },
    setInstructions: ({ instructions }) => {
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
