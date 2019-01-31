import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Header from '../../components/Header/Header';
import GameSettings from '../../containers/GameSettings/GameSettings';
import Turn from '../../components/Turn/Turn';

class Layout extends Component {
  displayHeadline = () => {
    let headline = '';

    if (this.props.turn === 0) {
      headline = 'Select Alien Empires';
    } else {
      const phase = this.props.phase === 'player' ? 'Player' : 'Aliens';
      headline = 'Turn #' + this.props.turn + ': ' + phase + ' Phase';
    }

    return headline;
  };

  render() {
    let current;

    if (this.props.turn > 0) {
      current = <Turn phase={this.props.phase} />;
    } else {
      current = <GameSettings />;
    }

    return (
      <Aux>
        <Header headline={this.displayHeadline()} />
        <main>{current}</main>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    turn: state.turn.turn,
    phase: state.turn.phase
  };
};

export default connect(mapStateToProps)(Layout);
