import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Instructions from '../../components/Instructions/Instructions';
import FleetEncounter from '../../components/FleetEncounter/FleetEncounter';
import PlayerTechReveal from '../../components/PlayerTechReveal/PlayerTechReveal';
import FleetConstruction from '../../components/FleetConstruction/FleetConstruction';
import HomeworldInvasion from '../../components/HomeworldInvasion/HomeworldInvasion';
import HomeworldElimination from '../../components/HomeworldElimination/HomeworldElimination';
import HomeworldDefenseConstruction from '../../components/HomeworldDefenseConstruction/HomeworldDefenseConstruction';
import GameOver from '../../components/GameOver/GameOver';

import * as actionTypes from '../../store/actions';

class PlayerPhase extends Component {
  /* the game always uses a single 10-sided die */
  rollDie = () => {
    return Math.floor(Math.random() * Math.floor(11));
  };

  pluralize = (ship, count) => {
    if (count > 1) {
      return ship + 's';
    } else {
      return ship;
    }
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
      return true;
    }

    return false;
  };

  checkForInvaded = aliens => {
    let invaded = false;

    aliens.forEach(alien => {
      if (alien.invaded) {
        invaded = true;
      }
    });

    return invaded;
  };

  checkForUninvaded = aliens => {
    let uninvaded = false;

    aliens.forEach(alien => {
      if (!alien.invaded) {
        uninvaded = true;
      }
    });

    return uninvaded;
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

  constructFleetHandler = () => {
    this.constructFleet('offensive');
  };

  constructFleet = (fleetType, defendingAlien, defenseInstructions) => {
    const aliens = [...this.props.aliens];
    const player = { ...this.props.player };
    let instructions = [];
    let currentRoll = 0;
    let defensive = false;
    let step = '';
    let alien = {};
    let fleet = {};

    if (fleetType === 'defensive') {
      defensive = true;
      alien = defendingAlien;
      const fleetID = alien.fleets.length + 1;

      fleet = {
        id: fleetID,
        cp: alien.fleetcp,
        encountered: true,
        raiders: 0,
        scouts: 0,
        destroyers: 0,
        cruisers: 0,
        battlecruisers: 0,
        battleships: 0,
        dreadnaughts: 0,
        carriers: 0,
        fighters: 0
      };

      alien.fleets.push(fleet);

      instructions = [...defenseInstructions];
    } else {
      alien = { ...this.props.currentAlien };
      fleet = { ...this.props.currentFleet };
    }

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
    }

    currentRoll = this.rollDie();

    if (
      alien.fighters > 0 &&
      alien.techcp > 24 &&
      player.pointDefense === 0 &&
      currentRoll < 7
    ) {
      alien.fighters += 1;
      alien.techcp -= 25;
    }

    currentRoll = this.rollDie();

    if (
      fleet.raiders > 0 &&
      alien.cloaking < 2 &&
      alien.techcp > 29 &&
      currentRoll < 7
    ) {
      alien.cloaking = 2;
      alien.techcp -= 30;
    }

    if (alien.techcp > 9) {
      if (alien.techcp < 15 && alien.minesweeper < 2) {
        alien.minesweeper += 1;
        alien.techcp -= 10;
      } else if (alien.techcp < 20 && alien.attack > 1 && alien.defense > 1) {
        alien.tactics += 1;
        alien.techcp -= 15;
      } else {
        let techSelected = false;

        while (!techSelected) {
          currentRoll = this.rollDie();

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
                }
              } else if (alien.tactics < 3 && alien.techcp > 14) {
                alien.tactics += 1;
                alien.techcp -= 15;
                techSelected = true;
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
              }
              break;
            case 7:
              /* upgrade scanners */

              if (alien.scanners < 2 && alien.techcp > 19) {
                alien.scanners += 1;
                alien.techcp -= 20;
                techSelected = true;
              }
              break;
            case 8:
              /* upgrade fighters */

              if (alien.fighters < 3 && alien.techcp > 24) {
                alien.fighters += 1;
                alien.techcp -= 25;
                techSelected = true;
              }
              break;
            case 9:
              /* upgrade point defense */

              if (alien.pointDefense < 3 && alien.techcp > 19) {
                alien.pointDefense += 1;
                alien.techcp -= 20;
                techSelected = true;
              }
              break;
            case 10:
              /* upgrade minesweeper */

              if (alien.minesweeper === 0 && alien.techcp > 9) {
                alien.minesweeper += 1;
                alien.techcp -= 10;
                techSelected = true;
              } else if (alien.minesweeper === 1 && alien.techcp > 14) {
                alien.minesweeper += 1;
                alien.techcp -= 15;
                techSelected = true;
              }
              break;
            default:
              /* This should be impossible to reach */
              techSelected = true;
          }
        }
      }
    }

    /* First attempt to build a fleet of carriers and fighters */

    currentRoll = this.rollDie();

    while (
      defensive === false &&
      fleet.cp > 27 &&
      alien.fighters > 0 &&
      (player.pointDefense === 0 || currentRoll < 5)
    ) {
      fleet.cp -= 27;
      fleet.carriers += 1;
      fleet.fighters += 3;
    }

    /* Next attempt to build a fleet of raiders */

    if (
      defensive === false &&
      fleet.carrier === false &&
      fleet.cp > 11 &&
      alien.cloaking > player.scanners
    ) {
      let targetRaiders = Math.floor(fleet.cp / 12);
      let actualRaiders = 0;

      while (fleet.cp > 11 && targetRaiders > 0) {
        actualRaiders += 1;
        targetRaiders -= 1;
        fleet.cp -= 12;
      }

      fleet.raiders += actualRaiders;

      /* Otherwise build a mixed fleet */
    } else if (fleet.raiders === 0) {
      /* Build the largest ship possible */
      if (alien.shipSize > 5 && fleet.cp > 23) {
        fleet.cp -= 24;
        fleet.dreadnaughts += 1;
      } else if (alien.shipSize > 4 && fleet.cp > 19) {
        fleet.cp -= 20;
        fleet.battleships += 1;
      } else if (alien.shipSize > 3 && fleet.cp > 14) {
        fleet.cp -= 15;
        fleet.battlecruisers += 1;
      } else if (alien.shipSize > 2 && fleet.cp > 11) {
        fleet.cp -= 12;
        fleet.cruisers += 1;
      } else if (alien.shipSize > 1 && fleet.cp > 8) {
        fleet.cp -= 9;
        fleet.destroyerBuilt = true;
        fleet.destroyers += 1;
      } else {
        fleet.cp -= 6;
        fleet.scouts += 1;
      }
    }

    if (fleet.raiders === 0) {
      /* Build a Destroyer, if needed */
      if (
        alien.scanners >= player.cloaking &&
        fleet.destroyerBuilt === false &&
        fleet.cp > 8
      ) {
        fleet.cp -= 9;
        fleet.destroyerBuilt = true;
        fleet.destroyers += 1;
      }

      currentRoll = this.rollDie();

      /* Get minimal number of Scouts needed */
      if (
        player.fighters > 0 &&
        alien.pointDefense > 0 &&
        currentRoll - 2 > 3 &&
        fleet.carriers === 0 &&
        fleet.cp > 11
      ) {
        fleet.cp -= 12;
        fleet.scouts += 2;
      }

      if (currentRoll < 4) {
        /* Build the largest fleet possible */

        while (fleet.cp > 9) {
          fleet.cp -= 6;
          fleet.scouts += 1;
        }

        if (fleet.cp === 9) {
          fleet.cp -= 9;
          fleet.destroyers += 1;
        } else if (fleet.cp > 5) {
          fleet.cp -= 6;
          fleet.scouts += 1;
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
            fleet.dreadnaughts += 1;
          } else if (alien.shipSize > 4 && fleet.cp > 19) {
            fleet.cp -= 20;
            fleet.battleships += 1;
          } else if (alien.shipSize > 3 && fleet.cp > 14) {
            fleet.cp -= 15;
            fleet.battlecruisers += 1;
          } else if (alien.shipSize > 2 && fleet.cp > 11) {
            fleet.cp -= 12;
            fleet.cruisers += 1;
          } else if (alien.shipSize > 1 && fleet.cp > 8) {
            fleet.cp -= 9;
            fleet.destroyerBuilt = true;
            fleet.destroyers += 1;
          } else {
            fleet.cp -= 6;
            fleet.scouts += 1;
          }
        }
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
    if (fleet.raiders > 0) {
      instructions.push(
        <li>
          This is a fleet of {fleet.raiders}{' '}
          {this.pluralize('raider', fleet.raiders)}
        </li>
      );
    }

    if (fleet.carriers > 0) {
      instructions.push(
        <li>
          Add {fleet.carriers} {this.pluralize('carrier', fleet.carriers)}
        </li>
      );
    }

    if (fleet.fighters > 0) {
      instructions.push(
        <li>
          Add {fleet.fighters} {this.pluralize('fighter', fleet.fighters)}
        </li>
      );
    }

    if (fleet.dreadnaughts > 0) {
      instructions.push(
        <li>
          Add {fleet.dreadnaughts}{' '}
          {this.pluralize('dreadnaught', fleet.dreadnaughts)}
        </li>
      );
    }

    if (fleet.battleships > 0) {
      instructions.push(
        <li>
          Add {fleet.battleships}{' '}
          {this.pluralize('battleship', fleet.battleships)}
        </li>
      );
    }

    if (fleet.battlecruisers > 0) {
      instructions.push(
        <li>
          Add {fleet.battlecruisers}{' '}
          {this.pluralize('battlecruiser', fleet.battlecruisers)}
        </li>
      );
    }

    if (fleet.cruisers > 0) {
      instructions.push(
        <li>
          Add {fleet.cruisers} {this.pluralize('cruiser', fleet.cruisers)}
        </li>
      );
    }

    if (fleet.destroyers > 0) {
      instructions.push(
        <li>
          Add {fleet.destroyers} {this.pluralize('destroyer', fleet.destroyers)}
        </li>
      );
    }

    if (fleet.scouts > 0) {
      instructions.push(
        <li>
          Add {fleet.scouts} {this.pluralize('scout', fleet.scouts)}
        </li>
      );

      if (alien.minesweeper > 0) {
        instructions.push(<li>All Scouts in this fleet have minesweeping</li>);
      }
    }

    if (defensive) {
      step = 'homeworld defense construction';
    } else {
      step = 'fleet construction';
    }

    this.props.updateAliensAndSetInstructions({
      aliens: aliens,
      alien: alien,
      fleet: fleet,
      step: step,
      instructions: instructions
    });
  };

  fleetConstructedHandler = () => {
    const aliens = [...this.props.aliens];
    let uninvaded = false;
    let step = '';

    /* Check for existing fleets */
    const fleetsExist = this.checkForFleets();

    if (fleetsExist) {
      step = 'fleet encounters';
    } else {
      uninvaded = this.checkForUninvaded(aliens);

      if (uninvaded) {
        step = 'homeworld invasions';
      }
    }

    if (step === '') {
      this.props.advancePhase();
    } else {
      this.props.setInstructions({
        step: step,
        instructions: []
      });
    }
  };

  homeworldEliminatedHandler = alienId => {
    const aliens = [...this.props.aliens];

    const index = aliens.findIndex(item => item.id === alienId);
    aliens.splice(index, 1);

    if (aliens.length === 0) {
      this.props.setInstructions({
        step: 'game over',
        instructions: []
      });

      this.props.updateAliensAndSetInstructions({
        aliens: aliens,
        alien: this.props.currentAlien,
        fleet: this.props.currentFleet,
        step: 'game over',
        instructions: []
      });
    } else {
      const invaded = this.checkForInvaded(aliens);

      if (invaded) {
        this.props.updateAliensAndSetInstructions({
          aliens: aliens,
          alien: this.props.currentAlien,
          fleet: this.props.currentFleet,
          step: 'homeworld eliminations',
          instructions: []
        });
      } else {
        this.props.updateAliensAndAdvancePhase({
          aliens: aliens,
          instructions: []
        });
      }
    }
  };

  homeworldInvadedHandler = alienId => {
    const aliens = [...this.props.aliens];
    const instructions = [];
    let currentRoll = 0;

    /* Look up this alien ID and get its defensecp */
    const alien = aliens.find(alien => alien.id === alienId);

    alien.invaded = true;

    /* Only report new mines and bases to be added */
    alien.mines = 0;
    alien.bases = 0;

    /* Calculate defenses */
    currentRoll = this.rollDie();

    if (currentRoll < 4) {
      /* Just buy mines */
      while (alien.defensecp > 4) {
        alien.mines += 1;
        alien.defensecp -= 5;
      }
    } else if (currentRoll > 7) {
      /* Buy as many bases as possible, then mines */
      while (alien.defensecp > 11) {
        alien.bases += 1;
        alien.defensecp -= 12;
      }

      while (alien.defensecp > 4) {
        alien.mines += 1;
        alien.defensecp -= 5;
      }
    } else {
      /* Alternate bases and mines, then get mines until broke */
      let purchased = '';

      while (alien.defensecp > 11) {
        if (purchased === 'base') {
          alien.mines += 1;
          alien.defensecp -= 5;
          purchased = 'mine';
        } else {
          alien.bases += 1;
          alien.defensecp -= 12;
          purchased = 'base';
        }
      }

      while (alien.defensecp > 4) {
        alien.mines += 1;
        alien.defensecp -= 5;
      }
    }

    instructions.push(
      <li>
        Add {alien.bases} bases and {alien.mines} mines to the{' '}
        <span className={alien.color}>{alien.color}</span> homeworld.
      </li>
    );

    /* Then constructFleet */
    this.constructFleet('defensive', alien, instructions);
  };

  homeworldDefenseConstructedHandler = () => {
    const aliens = [...this.props.aliens];

    let step = 'homeworld eliminations';

    aliens.forEach(alien => {
      if (alien.invaded === false) {
        step = 'homeworld invasions';
      }
    });

    /* return to encounter phase */
    this.props.setInstructions({
      step: step,
      instructions: []
    });
  };

  proceedHandler = step => {
    const aliens = [...this.props.aliens];

    if (step === 'no homeworld elimination') {
      /* advance to next econ phase */
      this.props.advancePhase();
    } else if (step === 'no homeworld invasion') {
      /* advance to elimination check or next phase */
      const invaded = this.checkForInvaded(aliens);

      if (invaded) {
        this.props.advanceStep({ step: 'homeworld eliminations' });
      } else {
        this.props.advancePhase();
      }
    } else if (step === 'no fleet encounter') {
      this.props.advanceStep({ step: 'homeworld invasions' });
    } else {
      const fleetsExist = this.checkForFleets();

      if (fleetsExist) {
        this.props.advanceStep({ step: 'fleet encounters' });
      } else {
        const uninvaded = this.checkForUninvaded(aliens);

        if (uninvaded) {
          this.props.advanceStep({ step: 'homeworld invasions' });
        } else {
          /* advance to next econ phase */
          this.props.advancePhase();
        }
      }
    }
  };

  render() {
    let step = this.props.step;
    let stepComponents;

    if (step === 'check for fleets') {
      let fleetsExist = this.checkForFleets();
      if (fleetsExist) {
        step = 'fleet encounters';
      } else {
        step = 'homeworld invasions';
      }
    }

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
          proceed={this.constructFleetHandler}
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
      const aliens = this.props.aliens.filter(alien => alien.invaded === false);
      stepComponents = (
        <HomeworldInvasion
          aliens={aliens}
          homeworldInvaded={this.homeworldInvadedHandler}
          proceed={this.proceedHandler}
        />
      );
    } else if (step === 'homeworld defense construction') {
      stepComponents = (
        <HomeworldDefenseConstruction
          instructions={this.props.instructions}
          homeworldDefenseConstructed={this.homeworldDefenseConstructedHandler}
        />
      );
    } else if (step === 'homeworld eliminations') {
      const aliens = this.props.aliens.filter(alien => alien.invaded === true);
      stepComponents = (
        <HomeworldElimination
          aliens={aliens}
          homeworldEliminated={this.homeworldEliminatedHandler}
          proceed={this.proceedHandler}
        />
      );
    } else if (step === 'game over') {
      stepComponents = <GameOver />;
    } else {
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
    updateAliensAndAdvancePhase: ({ aliens, instructions }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
      dispatch({
        type: actionTypes.SET_INSTRUCTIONS,
        payload: {
          instructions: instructions
        }
      });
      dispatch({ type: actionTypes.ADVANCE_PHASE });
    },
    updateAliensAndSetInstructions: ({
      aliens,
      alien,
      fleet,
      step,
      instructions
    }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
      dispatch({
        type: actionTypes.SET_CURRENT_ALIEN_AND_FLEET,
        payload: {
          alien: alien,
          fleet: fleet
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
