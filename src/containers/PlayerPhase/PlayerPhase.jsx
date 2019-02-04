import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  checkForFleets,
  checkForInvaded,
  checkForUninvaded
} from '../../utils/status';
import { constructFleet, constructDefenses } from '../../utils/construction';

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
  fleetEncounteredHandler = (alienId, fleetId) => {
    /* show screen with select boxes for all player techs */

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
    const constructed = constructFleet(
      'offensive',
      [...this.props.aliens],
      { ...this.props.currentAlien },
      { ...this.props.player },
      { ...this.props.currentFleet }
    );

    this.props.updateAliensAndSetInstructions(constructed);
  };

  fleetConstructedHandler = () => {
    const aliens = [...this.props.aliens];
    let step = '';

    /* Check for existing fleets */
    const fleetsExist = checkForFleets(aliens);

    if (fleetsExist) {
      step = 'fleet encounters';
    } else {
      let uninvaded = checkForUninvaded(aliens);

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

  homeworldInvadedHandler = alienId => {
    const aliens = [...this.props.aliens];

    const defenses = constructDefenses(aliens, alienId);

    /* Then constructFleet */
    const construction = constructFleet(
      'defensive',
      aliens,
      defenses.alien,
      { ...this.props.player },
      { ...this.props.currentFleet },
      defenses.instructions
    );

    this.props.updateAliensAndSetInstructions(construction);
  };

  homeworldDefenseConstructedHandler = () => {
    const invaded = checkForInvaded(this.props.aliens);
    let step = 'homeworld invasions';

    if (invaded) {
      step = 'homeworld eliminations';
    }

    /* return to encounter phase */
    this.props.setInstructions({
      step: step,
      instructions: []
    });
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
      const invaded = checkForInvaded(aliens);

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

  proceedHandler = step => {
    const aliens = [...this.props.aliens];

    if (step === 'no homeworld elimination') {
      /* advance to next econ phase */
      this.props.advancePhase();
    } else if (step === 'no homeworld invasion') {
      /* advance to elimination check or next phase */
      const invaded = checkForInvaded(aliens);

      if (invaded) {
        this.props.advanceStep({ step: 'homeworld eliminations' });
      } else {
        this.props.advancePhase();
      }
    } else if (step === 'no fleet encounter') {
      this.props.advanceStep({ step: 'homeworld invasions' });
    } else {
      const fleetsExist = checkForFleets(aliens);

      if (fleetsExist) {
        this.props.advanceStep({ step: 'fleet encounters' });
      } else {
        const uninvaded = checkForUninvaded(aliens);

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
    const aliens = [...this.props.aliens];
    let step = this.props.step;
    let stepComponents;

    if (step === 'check for fleets') {
      const fleetsExist = checkForFleets(aliens);
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
            aliens={aliens}
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
          color={this.props.currentAlien.color}
          fleetId={this.props.currentFleet.id}
          instructions={this.props.instructions}
          fleetConstructed={this.fleetConstructedHandler}
        />
      );
    } else if (step === 'homeworld invasions') {
      const filteredAliens = aliens.filter(alien => alien.invaded === false);
      stepComponents = (
        <HomeworldInvasion
          aliens={filteredAliens}
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
      const filteredAliens = aliens.filter(alien => alien.invaded === true);
      stepComponents = (
        <HomeworldElimination
          aliens={filteredAliens}
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
