import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import FleetConstruction from './FleetConstruction';
import FleetEncounter from './FleetEncounter';
import * as actionTypes from '../../store/actions';

import classes from './PlayerPhase.module.scss';

class PlayerPhase extends Component {
  state = {
    aliens: [],
    fleets: [],
    step: 'encounters',
    instructions: []
  };

  fleetEncounteredHandler = (alienId, fleetId, fleetCp, color) => {
    const instructions = [];

    instructions.push(
      <li>
        <span className={color}>
          {color} Fleet #{fleetId}
        </span>{' '}
        is {fleetCp}.
      </li>
    );

    /*
      1. What level fighters have you shown?
      2. IF player.fighters > 0 && alien.pointDefense === 0 THEN alien.pointDefense += 1 && alien.techcp -= 20
      3. What level mines have you shown?
      4. IF player.mines > 0 && alien.minesweeper === 0 THEN alien.minesweeper += 1 && alien.techcp -= 10
      5. What level raiders have you used in combat?
      6. IF player.raiders > alien.scanners && dieRoll < 5 THEN (alien.scanners += 1 && && alien.techcp -= 20) UNTIL (alien.scanners === player.raiders || alien.techcp < 20
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
      25. alien.fleetcp += remaining fleet.cp
        alien.fleets(splice this fleet)
      26. IF (alien.minesweeper > 0) 
        instructions.push('This alien scouts have minesweeping');
    */
    this.setState({ step: 'construction', instructions: instructions });
  };

  homeworldAttackedHandler = (alienId, color) => {
    const instructions = [];
    const cp = 0;

    /* Look up this alien ID and return its defensecp */

    instructions.push(
      <li>
        <span className={color}>{color}</span> has defense of {cp}.
      </li>
    );

    this.setState({ instructions: instructions });
  };

  proceedHandler = () => {
    this.props.onProceed();
  };

  render() {
    let step;

    if (this.state.step === 'encounters') {
      step = (
        <Aux>
          <FleetEncounter
            aliens={this.props.aliens}
            proceed={this.proceedHandler}
            fleetEncountered={this.fleetEncounteredHandler}
          />
          {/* TODO: Implement homeworld defense calculation */
          /*
            <p>Did you attack an alien homeworld?</p>
            <ul>
              {this.state.aliens.map((alien, index) => {
                  <li key={index}>
                    <button
                      onClick={this.homeworldAttackedHandler(
                        alien.id,
                        alien.color,
                        alien.class
                      )}
                      className={alien.class}
                    >
                      {alien.color}
                    </button>
                  </li>
              })}
              <li>
                <button className={classes.no} onClick={this.proceedHandler}>
                  No
                </button>
              </li>
            </ul>
            */}
        </Aux>
      );
    } else {
      step = (
        <FleetConstruction
          instructions={this.state.instructions}
          proceedHandler={this.proceedHandler}
        />
      );
    }

    return <div className={classes.instructions}>{step}</div>;
  }
}

const mapStateToProps = state => {
  return {
    aliens: state.aliens.aliens,
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
)(PlayerPhase);
