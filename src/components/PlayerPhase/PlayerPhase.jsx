import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';

import './PlayerPhase.module.scss';

class PlayerPhase extends Component {
  state = {
    instructions: ``
  };

  fleetEncounteredHandler = event => {
    const alien = this.props.opponents.find(
      opponent => opponent.id === event.target.id
    );

    this.setState({ instructions: `Encountered the ` + alien.id + ` fleet.` });
  };

  render() {
    let step;

    if (this.state.instructions === '') {
      step = (
        <Aux>
          <p>Did you encounter an alien fleet?</p>
          <ul>
            {this.props.opponents.map((opponent, index) => {
              if (opponent.active) {
                return (
                  <li
                    key={index}
                    id={opponent.id}
                    onClick={this.fleetEncounteredHandler}
                  >
                    {opponent.color}
                  </li>
                );
              }
              return '';
            })}
          </ul>
        </Aux>
      );
    } else {
      /* 
        1. Calculate fleet
        2. Print instructions
        */
    }

    return (
      <Aux>
        {step}
        <p>{this.state.instructions}</p>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    opponents: state.opponents.opponents,
    player: state.player.player,
    turn: state.turn.turn
  };
};

export default connect(mapStateToProps)(PlayerPhase);
