import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Instructions from '../../components/Instructions/Instructions';
import FleetEncounter from '../../components/FleetEncounter/FleetEncounter';
import PlayerTechReveal from '../../components/PlayerTechReveal/PlayerTechReveal';
import FleetConstruction from '../../components/FleetConstruction/FleetConstruction';
import HomeworldInvasion from '../../components/HomeworldInvasion/HomeworldInvasion';

import * as actionTypes from '../../store/actions';

class PlayerPhase extends Component {
  /* the game always uses a single 10-sided die */
  rollDie = () => {
    return Math.floor(Math.random() * Math.floor(11));
  };

  checkForFleets = () => {
    const aliens = [...this.props.aliens];
    const allFleets = [];

    aliens.forEach(alien => {
      const fleets = [...alien.fleets];

      fleets.forEach(fleet => {
        if (fleet.encountered === false) {
          allFleets.push({
            color: alien.color,
            alienId: alien.id,
            fleetId: fleet.id
          });
        }
      });
    });

    if (allFleets.length > 0) {
      return allFleets;
    } else {
      return null;
    }
  };

  fleetEncounteredHandler = (alienId, fleetId) => {
    /*
    show screen with select boxes for all player techs
    */
    const aliens = [...this.props.aliens];
    const alien = aliens.find(alien => alien.id === alienId);
    const fleet = alien.fleets.find(fleet => fleet.id === fleetId);

    /* Mark fleet as encountered */
    fleet.encountered = true;

    /* Store current alien and fleet, then get latest player tech in order to correctly build the fleet */
    this.props.updateCurrentFleet({
      step: 'player tech reveal',
      alien: alien,
      fleet: fleet
    });
  };

  playerTechUpdatedHandler = (id, value) => {
    const player = { ...this.props.player };

    switch (id) {
      case 'fightersSelector':
        player.fighters = parseInt(value);
        break;
      case 'pointDefenseSelector':
        player.pointDefense = parseInt(value);
        break;
      case 'cloakingSelector':
        player.cloaking = parseInt(value);
        break;
      case 'scannersSelector':
        player.scanners = parseInt(value);
        break;
      case 'minesSelector':
        player.mines = parseInt(value);
        break;
      default:
        break;
    }

    this.props.updatePlayerTech({
      player: player
    });
  };

  constructFleet = () => {
    const aliens = [...this.props.aliens];
    const alien = { ...this.props.currentAlien };
    const fleet = { ...this.props.currentFleet };
    const player = { ...this.props.player };
    const instructions = [];
    let currentRoll = 0;

    /* The following calculations and priorities are implementations of the scenario rules */
    if (player.fighters > 0 && alien.pointDefense === 0 && alien.techcp > 19) {
      alien.pointDefense += 1;
      alien.techcp -= 20;
    }

    if (player.mines > 0 && alien.minesweeper === 0 && alien.techcp > 9) {
      alien.minesweeper += 1;
      alien.techcp -= 10;
    }

    currentRoll = this.rollDie();

    while (
      player.cloaking > alien.scanners &&
      alien.techcp > 19 &&
      currentRoll < 5
    ) {
      alien.scanners += 1;
      alien.techcp -= 20;
    }

    currentRoll = this.rollDie();

    switch (alien.shipSize) {
      case 1:
        if (alien.techcp > 9) {
          alien.shipSize = 2;
          alien.techcp -= 10;
        }
        break;
      case 2:
        if (alien.techcp > 14 && currentRoll < 8) {
          alien.shipSize = 3;
          alien.techcp -= 15;
        }
        break;
      case 3:
        if (alien.techcp > 19 && currentRoll < 7) {
          alien.shipSize = 4;
          alien.techcp -= 20;
        }
        break;
      case 4:
        if (alien.techcp > 19 && currentRoll < 6) {
          alien.shipSize = 5;
          alien.techcp -= 20;
        }
        break;
      case 5:
        if (alien.techcp > 19 && currentRoll < 4) {
          alien.shipSize = 6;
          alien.techcp -= 20;
        }
        break;
      default:
        /* This should be impossible to reach */
        console.log('IMPOSSIBLE!');
    }

    console.log('Current alien tech CP is ' + alien.techcp);

    currentRoll = this.rollDie();

    console.log('Current roll = ' + currentRoll);

    if (
      alien.fighters > 0 &&
      alien.techcp > 24 &&
      player.pointDefense === 0 &&
      currentRoll < 7
    ) {
      alien.fighters += 1;
      alien.techcp -= 25;
      console.log(
        'Die roll under 7 and alien has fighters, so alien spent 25 to upgrade fighters'
      );
    }

    currentRoll = this.rollDie();

    console.log('Current roll = ' + currentRoll);

    if (
      fleet.raider === true &&
      alien.cloaking < 2 &&
      alien.techcp > 29 &&
      currentRoll < 7
    ) {
      alien.cloaking = 2;
      alien.techcp -= 30;
      console.log(
        'Die roll under 7 and alien fleet is raiders, so alien spent 30 to upgrade cloaking'
      );
    }

    console.log('Current alien tech CP is ' + alien.techcp);

    if (alien.techcp > 9) {
      if (alien.techcp < 15 && alien.minesweeper < 2) {
        alien.minesweeper += 1;
        alien.techcp -= 10;
        console.log('Alien researched minesweeping for 10');
      } else if (alien.techcp < 20 && alien.attack > 1 && alien.defense > 1) {
        alien.tactics += 1;
        alien.techcp -= 15;
        console.log('Alien researched tactics for 15');
      } else {
        let techSelected = false;

        while (!techSelected) {
          currentRoll = this.rollDie();
          console.log('Current roll = ' + currentRoll);

          switch (currentRoll) {
            case 1:
            case 2:
              /* upgrade attack */
              if (alien.attack < 3) {
                let attackCost = 20;

                if (alien.attack === 1) {
                  attackCost = 30;
                } else if (alien.attack === 2) {
                  attackCost = 25;
                }

                if (alien.techcp >= attackCost) {
                  alien.attack += 1;
                  alien.techcp -= attackCost;
                  techSelected = true;
                  console.log(
                    'Die roll was 1/2 so Alien researched attack for ' +
                      attackCost
                  );
                }
              }
              break;
            case 3:
            case 4:
              /* upgrade defense */

              if (alien.defense < 3) {
                let defenseCost = 20;

                if (alien.defense === 1) {
                  defenseCost = 30;
                } else if (alien.defense === 2) {
                  defenseCost = 25;
                }

                if (alien.techcp >= defenseCost) {
                  alien.defense += 1;
                  alien.techcp -= defenseCost;
                  techSelected = true;
                  console.log(
                    'Die roll was 3/4 so Alien researched defense for ' +
                      defenseCost
                  );
                }
              }
              break;
            case 5:
              /* upgrade attack to 2, then defense to 2, then tactics */

              if (alien.attack < 2) {
                let attackCost = 20;

                if (alien.attack === 1) {
                  attackCost = 30;
                }

                if (alien.techcp >= attackCost) {
                  alien.attack += 1;
                  alien.techcp -= attackCost;
                  techSelected = true;
                  console.log(
                    'Die roll was 5 BUT attack < 2 so Alien researched attack for ' +
                      attackCost
                  );
                }
              } else if (alien.defense < 2) {
                let defenseCost = 20;

                if (alien.defense === 1) {
                  defenseCost = 30;
                }

                if (alien.techcp >= defenseCost) {
                  alien.defense += 1;
                  alien.techcp -= defenseCost;
                  techSelected = true;
                  console.log(
                    'Die roll was 5 BUT defense < 2 so Alien researched defense for ' +
                      defenseCost
                  );
                }
              } else if (alien.tactics < 3 && alien.techcp > 14) {
                alien.tactics += 1;
                alien.techcp -= 15;
                techSelected = true;
                console.log(
                  'Die roll was 5 so Alien researched tactics for 15'
                );
              }
              break;
            case 6:
              /* upgrade cloaking */

              if (
                alien.cloaking < 2 &&
                player.scanners < 2 &&
                alien.techcp > 29
              ) {
                alien.cloaking += 1;
                alien.techcp -= 30;
                techSelected = true;
                console.log(
                  'Die roll was 6 so Alien researched cloaking for 30'
                );
              }
              break;
            case 7:
              /* upgrade scanners */

              if (alien.scanners < 2 && alien.techcp > 19) {
                alien.scanners += 1;
                alien.techcp -= 20;
                techSelected = true;
                console.log(
                  'Die roll was 7 so Alien researched scanners for 20'
                );
              }
              break;
            case 8:
              /* upgrade fighters */

              if (alien.fighters < 3 && alien.techcp > 24) {
                alien.fighters += 1;
                alien.techcp -= 25;
                techSelected = true;
                console.log(
                  'Die roll was 8 so Alien researched fighters for 25'
                );
              }
              break;
            case 9:
              /* upgrade point defense */

              if (alien.pointDefense < 3 && alien.techcp > 19) {
                alien.pointDefense += 1;
                alien.techcp -= 20;
                techSelected = true;
                console.log(
                  'Die roll was 9 so Alien researched point defense for 20'
                );
              }
              break;
            case 10:
              /* upgrade minesweeper */

              if (alien.minesweeper === 0 && alien.techcp > 9) {
                alien.minesweeper += 1;
                alien.techcp -= 10;
                techSelected = true;
                console.log(
                  'Die roll was 10 so Alien researched minesweeper for 10'
                );
              } else if (alien.minesweeper === 1 && alien.techcp > 14) {
                alien.minesweeper += 1;
                alien.techcp -= 15;
                techSelected = true;
                console.log(
                  'Die roll was 10 so Alien researched minesweeper 2 for 15'
                );
              }
              break;
            default:
              /* This should be impossible to reach */
              console.log('IMPOSSIBLE!');
              techSelected = true;
          }
        }
      }
    }

    /* First attempt to build a fleet of carriers and fighters */

    currentRoll = this.rollDie();

    console.log('Current roll = ' + currentRoll);

    while (
      fleet.cp > 27 &&
      alien.fighters > 0 &&
      (player.pointDefense === 0 || currentRoll < 5)
    ) {
      fleet.carrier = true;
      fleet.cp -= 27;
      instructions.push(
        <li>Add a Carrier and 3 Fighters (level {alien.fighters})</li>
      );
    }

    /* Next attempt to build a fleet of raiders */

    if (
      fleet.carrier === false &&
      fleet.cp > 11 &&
      alien.cloaking > player.scanners
    ) {
      fleet.raider = true;

      let targetRaiders = Math.floor(fleet.cp / 12);
      var actualRaiders = 0;

      while (fleet.cp > 11 && targetRaiders > 0) {
        actualRaiders += 1;
        targetRaiders -= 1;
        fleet.cp -= 12;
      }

      instructions.push(
        <li>
          Add {actualRaiders} Raiders with cloaking level {alien.cloaking}
        </li>
      );

      /* Otherwise build a mixed fleet */
    } else if (fleet.raider === false) {
      /* Build the largest ship possible */
      if (alien.shipSize > 5 && fleet.cp > 23) {
        fleet.cp -= 24;
        instructions.push(<li>Add a Dreadnaught</li>);
      } else if (alien.shipSize > 4 && fleet.cp > 19) {
        fleet.cp -= 20;
        instructions.push(<li>Add a Battleship</li>);
      } else if (alien.shipSize > 3 && fleet.cp > 14) {
        fleet.cp -= 15;
        instructions.push(<li>Add a Battlecruiser</li>);
      } else if (alien.shipSize > 2 && fleet.cp > 11) {
        fleet.cp -= 12;
        instructions.push(<li>Add a Cruiser</li>);
      } else if (alien.shipSize > 1 && fleet.cp > 8) {
        fleet.cp -= 9;
        fleet.destroyerBuilt = true;
        instructions.push(<li>Add a Destroyer</li>);
      } else {
        fleet.cp -= 6;
        instructions.push(<li>Add a Scout</li>);
      }
    }

    if (fleet.raider) {
      instructions.push(<li>This is a raider fleet</li>);
    } else {
      /* Build a Destroyer, if needed */
      if (
        alien.scanners >= player.cloaking &&
        fleet.destroyerBuilt === false &&
        fleet.cp > 8
      ) {
        fleet.cp -= 9;
        fleet.destroyerBuilt = true;
        instructions.push(<li>Add a Destroyer</li>);
      }

      currentRoll = this.rollDie();

      console.log('Current roll = ' + currentRoll);

      /* Get minimal number of Scouts needed */
      if (
        player.fighters > 0 &&
        alien.pointDefense > 0 &&
        currentRoll - 2 > 3 &&
        fleet.carrier === false &&
        fleet.cp > 11
      ) {
        fleet.cp -= 12;
        instructions.push(<li>Add 2 Scouts</li>);
      }

      if (currentRoll < 4) {
        /* Build the largest fleet possible */

        while (fleet.cp > 9) {
          fleet.cp -= 6;
          instructions.push(<li>Add a Scout</li>);
        }

        if (fleet.cp === 9) {
          fleet.cp -= 9;
          instructions.push(<li>Add a Destroyer</li>);
        } else if (fleet.cp > 5) {
          fleet.cp -= 6;
          instructions.push(<li>Add a Scout</li>);
        }

        /* TODO: Calculate a balanced fleet. This is a trickier algorithm 

      } else if (currentRoll < 7) {

        22. ELSE 
              IF (alien.attack > 2 || alien.defense > 2)
                GOTO 16
              ELSE IF (alien.attack > 1 || alien.defense > 1)
                GOTO 23
              ELSE 
                GOTO 24              
        23. CALCULATE fleet composition for maximum cost effectiveness
            NO DREADNAUGHTS OR BATTLESHIPS
        24. CALCULATE fleet composition for maximum cost effectiveness
            DESTROYERS AND SCOUTS ONLY
        */
      } else {
        /* Build the largest ships possible */
        while (fleet.cp > 5) {
          if (alien.shipSize > 5 && fleet.cp > 23) {
            fleet.cp -= 24;
            instructions.push(<li>Add a Dreadnaught</li>);
          } else if (alien.shipSize > 4 && fleet.cp > 19) {
            fleet.cp -= 20;
            instructions.push(<li>Add a Battleship</li>);
          } else if (alien.shipSize > 3 && fleet.cp > 14) {
            fleet.cp -= 15;
            instructions.push(<li>Add a Battlecruiser</li>);
          } else if (alien.shipSize > 2 && fleet.cp > 11) {
            fleet.cp -= 12;
            instructions.push(<li>Add a Cruiser</li>);
          } else if (alien.shipSize > 1 && fleet.cp > 8) {
            fleet.cp -= 9;
            fleet.destroyerBuilt = true;
            instructions.push(<li>Add a Destroyer</li>);
          } else {
            fleet.cp -= 6;
            instructions.push(<li>Add a Scout</li>);
          }
        }
      }

      if (alien.minesweeper > 0) {
        instructions.push(<li>All Scouts in this fleet have minesweeping</li>);
      }
    }

    /* Return any remaining fleet CP */
    alien.fleetcp += fleet.cp;
    fleet.cp = 0;

    /* Update alien with revised fleet info */
    const fleets = [...alien.fleets];
    let index = fleets.findIndex(item => item.id === fleet.id);
    fleets.splice(index, 1, fleet);
    alien.fleets = fleets;

    /* Update this alien's technologies */
    /* Update the alien in the aliens array and push it to Redux */
    index = aliens.findIndex(item => item.id === alien.id);
    aliens.splice(index, 1, alien);

    /* show the fleet construction instructions */
    this.props.updateAliensAndSetInstructions({
      aliens: aliens,
      step: 'fleet construction',
      instructions: instructions
    });
  };

  fleetConstructedHandler = () => {
    let fleetsExist = null;
    let step = 'homeworld invasions';

    /* Check for existing fleets */
    fleetsExist = this.checkForFleets();

    if (fleetsExist !== null) {
      step = 'fleet encounters';
    }

    /* return to encounter phase */
    this.props.setInstructions({
      step: step,
      instructions: []
    });
  };

  homeworldInvadedHandler = alienId => {
    const aliens = [...this.props.aliens];
    const instructions = [];

    /* Look up this alien ID and get its defensecp */
    const alien = aliens.find(alien => alien.id === alienId);

    instructions.push(
      <li>
        <span className={alien.color}>{alien.color}</span> has defense of{' '}
        {alien.defenseCp}.
      </li>
    );

    this.props.setInstructions({
      step: 'defense construction',
      instructions: instructions
    });
  };

  proceedHandler = stage => {
    if (stage === 'no fleet encounter') {
      /* go to homeworld invasion */
      this.props.advanceStep({ step: 'homeworld invasions' });
    } else if (stage === 'no homeworld invasion') {
      /* advance to next econ phase */
      this.props.advancePhase();
    } else {
    }
  };

  render() {
    const step = this.props.step;
    let stepComponents;

    if (step === 'fleet encounters') {
      stepComponents = (
        <Aux>
          <FleetEncounter
            aliens={this.props.aliens}
            proceed={this.proceedHandler}
            fleetEncountered={this.fleetEncounteredHandler}
          />
        </Aux>
      );
    } else if (step === 'player tech reveal') {
      stepComponents = (
        <PlayerTechReveal
          player={this.props.player}
          playerTechUpdated={this.playerTechUpdatedHandler}
          proceed={this.constructFleet}
        />
      );
    } else if (step === 'fleet construction') {
      stepComponents = (
        <FleetConstruction
          instructions={this.props.instructions}
          fleetConstructed={this.fleetConstructedHandler}
        />
      );
    } else if (step === 'homeworld invasions') {
      stepComponents = (
        <HomeworldInvasion
          aliens={this.props.aliens}
          homeworldInvaded={this.homeworldInvadedHandler}
          proceed={this.proceedHandler}
        />
      );
    } else {
      console.log('UNHANDLED EXCEPTION');
      stepComponents = (
        <Instructions
          instructions={this.props.instructions}
          proceedHandler={this.proceedHandler}
        />
      );
    }

    return <Aux>{stepComponents}</Aux>;
  }
}

const mapStateToProps = state => {
  return {
    aliens: state.aliens.aliens,
    currentAlien: state.aliens.currentAlien,
    currentFleet: state.aliens.currentFleet,
    player: state.player.player,
    turn: state.turn.turn,
    phase: state.turn.phase,
    step: state.turn.step,
    instructions: state.instructions.instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    advancePhase: () => {
      dispatch({ type: actionTypes.ADVANCE_PHASE });
    },
    advanceStep: ({ step }) => {
      dispatch({
        type: actionTypes.ADVANCE_STEP,
        payload: {
          step: step
        }
      });
    },
    updateCurrentFleet: ({ step, alien, fleet }) => {
      dispatch({
        type: actionTypes.ADVANCE_STEP,
        payload: {
          step: step
        }
      });
      dispatch({
        type: actionTypes.SET_CURRENT_ALIEN_AND_FLEET,
        payload: {
          alien: alien,
          fleet: fleet
        }
      });
    },
    updateAliens: ({ aliens }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
    },
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
    updatePlayerTech: ({ player }) => {
      dispatch({
        type: actionTypes.UPDATE_PLAYER_TECH,
        payload: {
          player: player
        }
      });
    },
    setInstructions: ({ step, instructions }) => {
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerPhase);
