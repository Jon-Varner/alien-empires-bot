import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import * as actionTypes from '../../store/actions';

import classes from './PlayerPhase.module.scss';

class PlayerPhase extends Component {
  state = {
    aliens: [],
    fleets: [],
    instructions: []
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

  fleetEncounteredHandler = (alienId, fleetId, fleetCp, color, alienClass) => {
    const instructions = [];

    instructions.push(
      <li>
        <span className={alienClass}>
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
            const numberOfRaiders = Math.floor(alien.fleetcp / 12);
            alien.fleetcp -= numberOfRaiders * 12;
            instructions.push('add numberOfRaiders');
            GOTO END
      14. IF (alien.fleetcp > 27 && alien.fighters > 0 && (player.pointDefense === 0 || dieRoll < 5))
            carrierFleet = true
            alien.fleetcp -= 27
            instructions.push('Add a carrier and 3 fighters to fleet')
            GOTO 14 until false
            GOTO 15
      15. IF (!carrierFleet && alien.cloaking > player.scanners && alien.fleetcp > 11 )
            const numberOfRaiders = Math.floor(alien.fleetcp / 12);
            alien.fleetcp -= numberOfRaiders * 12;
            instructions.push('add numberOfRaiders');
            GOTO END
          ELSE GOTO 16
      16. IF (alien.fleetcp > 23) 
            IF (alien.shipSize > 2) 
              alien.fleetcp -= 24
              instructions.push('add a Dreadnaught');
            ELSE IF (alien.shipSize > 1)           
              alien.fleetcp -= 15
              instructions.push('add a Battlecruiser');   
            ELSE
              alien.fleetcp -= 9
              instructions.push('add a Destroyer');               
          ELSE IF (alien.fleetcp > 19)
            IF (alien.shipSize > 2)           
              alien.fleetcp -= 20
              instructions.push('add a Battleship');            
            ELSE IF (alien.shipSize > 1)           
              alien.fleetcp -= 15
              instructions.push('add a Battlecruiser');   
            ELSE
              alien.fleetcp -= 9
              instructions.push('add a Destroyer'); 
          ELSE IF (alien.fleetcp > 14)
            IF (alien.shipSize > 1)           
              alien.fleetcp -= 15
              instructions.push('add a Battlecruiser');   
            ELSE
              alien.fleetcp -= 9
              instructions.push('add a Destroyer'); 
          ELSE IF (alien.fleetcp > 11)
            IF (alien.shipSize > 1)           
              alien.fleetcp -= 12
              instructions.push('add a Cruiser');   
            ELSE
              alien.fleetcp -= 9
              instructions.push('add a Destroyer');                
          ELSE IF (alien.fleetcp > 8)
              alien.fleetcp -= 9
              instructions.push('add a Destroyer');   
          ELSE
              alien.fleetcp -= 6
              instructions.push('add a Scout');  
      17. 
    */
    this.setState({ instructions: instructions });
  };

  proceedHandler = () => {
    this.props.onProceed();
  };

  componentDidMount() {
    const aliens = [...this.props.aliens];
    this.setState({ aliens: aliens });
  }

  render() {
    let step;

    if (this.state.instructions.length === 0) {
      const allFleets = [];

      this.state.aliens.map(alien => {
        const alienClass = this.getAlienClass(alien.color);
        const fleets = [...alien.fleets];

        fleets.map(fleet => {
          allFleets.push({
            color: alien.color,
            alienId: alien.id,
            fleetId: fleet.id,
            fleetCp: fleet.cp,
            class: alienClass
          });
        });
      });

      step = (
        <Aux>
          <p>Did you encounter an alien fleet?</p>
          <ul>
            {allFleets.map((fleet, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={this.fleetEncounteredHandler(
                      fleet.alienId,
                      fleet.fleetId,
                      fleet.fleetCp,
                      fleet.color,
                      fleet.class
                    )}
                    className={fleet.class}
                  >
                    {fleet.color} Fleet #{fleet.fleetId}
                  </button>
                </li>
              );
            })}
            <li>
              <button className={classes.no} onClick={this.proceedHandler}>
                No
              </button>
            </li>
          </ul>
        </Aux>
      );
    } else {
      step = (
        <Aux>
          <ol>
            {this.state.instructions.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </ol>
          <button onClick={this.proceedHandler}>Go to Econ Phase</button>
        </Aux>
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
