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

    /* Store current alien and fleet to local state,
        then get latest player tech in order to correctly build the fleet */
    this.props.onUpdateCurrentFleet({
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

    this.props.onUpdatePlayerTech({
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

    /*
      1. What level fighters have you shown?
      2. IF player.fighters > 0 && alien.pointDefense === 0 THEN alien.pointDefense += 1 && alien.techcp -= 20
      3. What level mines have you shown?
      4. IF player.mines > 0 && alien.minesweeper === 0 THEN alien.minesweeper += 1 && alien.techcp -= 10
      5. What level raiders have you used in combat?
      6. IF player.cloaking > alien.scanners && dieRoll < 5 THEN (alien.scanners += 1 && && alien.techcp -= 20) UNTIL (alien.scanners === player.cloaking || alien.techcp < 20
      7. IF alien.shipSize===1 || (alien.shipSize===2 && dieRoll < 8) || (alien.shipSize===3 && dieRoll < 7) || (alien.shipSize===4 && dieRoll < 6) || (alien.shipSize===5 && dieRoll < 4) THEN alien.shipSize +=1 and alien.techcp -(10||15||20||20||20)
      8. Have you shown point defense? 
      9. IF alien.fighters > 0 && player.pointDefense===0 && dieRoll < 7 THEN alien.fighters += 1 && alien.techcp -=25
      10. IF raider fleet && alien.cloaking < 2 && dieRoll < 7 THEN alien.cloaking===2  and alien.techcp -= 30
      11. What level scanner have you shown?
      12. IF alien.techcp < 10 no dieRoll
            ELSE IF alien.techcp < 15 && alien.minesweeper < 10 THEN alien.minesweeper += 1 && alien.techcp -= 10 ELSE GOTO 13
            ELSE IF alien.techcp < 20 && alien.attack > 1 && alien.defense > 1 THEN alien.tactics += 1 && alien.techcp -=15 ELSE GOTO 13
            ELSE 
              dieRoll: 
                1-2 = attack
                3-4 = defense
                5 = tactics
                6 = cloak
                7 = scan
                8 = fighter
                9 = point defense
                10 = minesweeper

                case attack: 
                  IF (alien.attack > 3 || alien.attackCost > alien.techcp) reroll ELSE alien.attack += 1 && alien.techcp -= alien.attackCost
                case defense:
                  IF (alien.defense > 3 || alien.defenseCost > alien.techcp) reroll ELSE alien.defense += 1 && alien.techcp -= alien.defenseCost    
                case tactics:
                  IF alien.attack < 2 
                    IF (alien.attackCost > alien.techcp) reroll ELSE alien.attack += 1 && alien.techcp -= alien.attackCost
                  IF alien.defense < 2
                    IF (alien.defenseCost > alien.techcp) reroll ELSE alien.defense += 1 && alien.techcp -= alien.defenseCost
                  ELSE
                    IF alien.tactics > 2 THEN reroll ELSE alien.tactics += 1 && alien.techcp -= 15
                case cloak:
                  IF (alien.cloaking > 1 || player.scanners > 1 || alien.techcp < 30) THEN reroll ELSE alien.cloaking =+ 1 && alien.techcp -= 30
                case scan:
                  IF (alien.scanners > 1 || alien.techcp < 20) THEN reroll ELSE alien.scanners += 1 && alien.techcp -= 20
                case fighter:
                  IF (alien.fighters > 2 || alien.techcp < 25) THEN reroll ELSE alien.fighters += 1 && alien.techcp -= 25
                case point defense:
                  IF (alien.pointDefense > 2 || alien.techcp < 20) THEN reroll ELSE alien.pointDefense += 1 && alien.techcp -= 20
                case minesweeper:
                  IF (alien.minesweeper > 1 || alien.techcp < mine sweeper cost [10||15]) THEN reroll ELSE alien.minesweeper += 1 && alien.techcp -= [10||15]
      13. IF raider fleet,
            const numberOfRaiders = Math.floor(fleet.cp / 12);
            fleet.cp -= numberOfRaiders * 12;
            instructions.push('add numberOfRaiders');
            GOTO END
      14. IF (fleet.cp > 27 && alien.fighters > 0 && (player.pointDefense === 0 || dieRoll < 5))
            carrierFleet = true
            fleet.cp -= 27
            instructions.push('Add a carrier and 3 fighters to fleet')
            GOTO 14 until false
            GOTO 15
      15. IF (!carrierFleet && alien.cloaking > player.scanners && fleet.cp > 11 )
            const numberOfRaiders = Math.floor(fleet.cp / 12);
            fleet.cp -= numberOfRaiders * 12;
            instructions.push('add numberOfRaiders');
            GOTO END
          ELSE GOTO 16
      16. IF (alien.shipSize > 5 && fleet.cp > 23) 
            fleet.cp -= 24
            instructions.push('add a Dreadnaught');
          ELSE IF (alien.shipSize > 4 && fleet.cp > 19) 
            fleet.cp -= 20
            instructions.push('add a Battleship');   
          ELSE IF (alien.shipSize > 3 && fleet.cp > 14) 
            fleet.cp -= 15
            instructions.push('add a Battlecruiser');   
          ELSE IF (alien.shipSize > 2 && fleet.cp > 11)
            fleet.cp -= 12
            instructions.push('add a Cruiser');   
          ELSE IF (alien.shipSize > 1 && fleet.cp > 8)
              fleet.cp -= 9
              instructions.push('add a Destroyer'); 
              destroyerBuilt = true
          ELSE
              fleet.cp -= 6
              instructions.push('add a Scout'); 
      17. IF (alien.scanners >= player.cloaking && destroyerBuilt===false && fleet.cp > 8)
            fleet.cp -= 9
            instructions.push('add a Destroyer');
      18. IF (dieRoll < 4) THEN largest fleet 
          ELSE IF (dieRoll < 7) THEN balanced
          ELSE largest ships       
      19. IF (player.fighters > 0 && alien.pointDefense > 0 && (above dieRoll-2 > 3 ) && !carrierFleet && fleet.cp > 11)
          fleet.cp -= 12
          instructions.push('add 2 Scouts');

      20. IF (largest fleet)
            UNTIL (fleet.cp < 10)
              fleet.cp -= 6;
              instructions.push('add a Scout');
            THEN IF (fleet.cp===9)
                fleet.cp -= 9;
                instructions.push('add a Destroyer');
              ELSE
                fleet.cp -= 6;
                instructions.push('add a Scout');
      21. ELSE IF (largest ships)
            UNTIL (fleet.cp < 6)                        
              GOTO 16    
      25. alien.fleetcp += remaining fleet.cp

      26. IF (alien.minesweeper > 0) 
        instructions.push('This alien scouts have minesweeping');                                                  
    */

    console.log('Current alien tech CP is ' + alien.techcp);

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
          alien.shipSize = 3;
          alien.techcp -= 20;
        }
        break;
      case 4:
        if (alien.techcp > 19 && currentRoll < 6) {
          alien.shipSize = 3;
          alien.techcp -= 20;
        }
        break;
      case 5:
        if (alien.techcp > 19 && currentRoll < 4) {
          alien.shipSize = 3;
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
      fleet.raider === true &&
      alien.cloaking < 2 &&
      alien.techcp > 29 &&
      currentRoll < 7
    ) {
      alien.cloaking = 2;
      alien.techcp -= 30;
    }

    if (alien.techcp > 9) {
      if (alien.techcp < 15 && alien.minesweeper < 10) {
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
                var attackCost = 20;

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
                var defenseCost = 20;

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
                attackCost = 20;

                if (alien.attack === 1) {
                  attackCost = 30;
                }

                if (alien.techcp >= attackCost) {
                  alien.attack += 1;
                  alien.techcp -= attackCost;
                  techSelected = true;
                }
              } else if (alien.defense < 2) {
                defenseCost = 20;

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
    } else {
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

    alien.fleetcp += fleet.cp;
    fleet.cp = 0;

    /* Update this alien's technologies */
    /* Update the alien in the aliens array and push it to Redux */
    let index = aliens.findIndex(item => item.id === alien.id);
    aliens.splice(index, 1, alien);
    this.props.onUpdateAliens({ aliens: aliens });

    /* show the fleet construction instructions */
    this.props.onSetInstructions({
      step: 'fleet construction',
      instructions: instructions
    });
  };

  fleetConstructedHandler = () => {
    const aliens = [...this.props.aliens];
    const alien = { ...this.props.currentAlien };
    const fleet = { ...this.props.currentFleet };
    let fleetsExist = null;
    let step = 'homeworld invasions';

    /* Return any remaining fleet CP */

    alien.fleetcp += fleet.cp;

    /* Update aliens with revised fleets and fleet CPs */

    const fleets = [...alien.fleets];
    let index = fleets.findIndex(item => item.id === fleet.id);
    fleets.splice(index, 1, fleet);
    alien.fleets = fleets;

    /* Update the alien in the aliens array and push it to Redux */
    index = aliens.findIndex(item => item.id === alien.id);
    aliens.splice(index, 1, alien);
    this.props.onUpdateAliens({ aliens: aliens });

    /* Check for existing fleets */
    fleetsExist = this.checkForFleets();

    if (fleetsExist !== null) {
      step = 'fleet encounters';
    }

    /* return to encounter phase */
    this.props.onSetInstructions({
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

    this.props.onSetInstructions({
      step: 'defense construction',
      instructions: instructions
    });
  };

  proceedHandler = stage => {
    if (stage === 'no fleet encounter') {
      /* go to homeworld invasion */
      this.props.onAdvanceStep({ step: 'homeworld invasions' });
    } else if (stage === 'no homeworld invasion') {
      /* advance to next econ phase */
      this.props.onAdvancePhase();
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
    onAdvancePhase: () => {
      dispatch({ type: actionTypes.ADVANCE_PHASE });
    },
    onAdvanceStep: ({ step }) => {
      dispatch({
        type: actionTypes.ADVANCE_STEP,
        payload: {
          step: step
        }
      });
    },
    onUpdateCurrentFleet: ({ step, alien, fleet }) => {
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
    onUpdateAliens: ({ aliens }) => {
      dispatch({
        type: actionTypes.UPDATE_ALIENS,
        payload: {
          aliens: aliens
        }
      });
    },
    onUpdatePlayerTech: ({ player }) => {
      dispatch({
        type: actionTypes.UPDATE_PLAYER_TECH,
        payload: {
          player: player
        }
      });
    },
    onSetInstructions: ({ step, instructions }) => {
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
