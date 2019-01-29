import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';

import classes from './AlienPhase.module.scss';

class AlienPhase extends Component {
  state = {
    aliens: [],
    instructions: []
  };

  /* the game always uses a single 10-sided die */
  rollDie = () => {
    return Math.floor(Math.random() * Math.floor(11));
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

  getInstructions = (turn, player, aliens, cp) => {
    let instructions = [];
    let fleetLaunchTarget = 0;
    let launchModifier = 0;
    let raider = false;
    let fleetLaunched = false;
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

        console.log('launch target=' + fleetLaunchTarget);
        console.log('launch roll = ' + currentRoll);
        console.log('launch modifier = ' + launchModifier);

        currentRoll -= launchModifier;

        console.log('modified roll =' + currentRoll);

        if (currentRoll <= fleetLaunchTarget) {
          /* Build a fleet of all affordable raiders or make the fleet's CP for later */

          if (raider) {
            console.log('build a raider fleet');
            const numberOfRaiders = Math.floor(alien.fleetcp / 12);
            alien.fleetcp -= numberOfRaiders * 12;

            instructions.push(
              <li>
                <span className={alien.color}>{alien.color}</span> alien
                launches a fleet of {numberOfRaiders} raiders.
              </li>
            );
          } else {
            const fleetID = alien.fleets.length + 1;
            alien.fleets.push({
              id: fleetID,
              cp: alien.fleetcp,
              encountered: false
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

    this.setState({
      aliens: aliens
    });

    return instructions;
  };

  advanceHandler = () => {
    this.props.onUpdateAliens({
      aliens: this.state.aliens
    });
  };

  componentDidMount() {
    const instructions = this.getInstructions(
      this.props.turn,
      this.props.player,
      [...this.props.aliens],
      this.props.cpPerTurn
    );

    this.setState({ instructions: instructions });
  }

  render() {
    return (
      <div className={classes.instructions}>
        <ol>
          {this.state.instructions.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </ol>
        <button className="advance" onClick={this.advanceHandler}>
          END TURN
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cpPerTurn: state.aliens.cpPerTurn,
    aliens: state.aliens.aliens,
    player: state.player.player,
    turn: state.turn.turn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateAliens: payload => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: payload
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
