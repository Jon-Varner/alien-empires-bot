import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Header from '../../components/Header/Header';
import GameSettings from '../../containers/GameSettings/GameSettings';
import Turn from '../../components/Turn/Turn';

class Layout extends Component {
  displayHeadline = () => {
    let headline = '';

    if (this.props.turn.turn === 0) {
      headline = 'Select Alien Empires';
    } else {
      const phase = this.props.turn.phase === 'player' ? 'Player' : 'Aliens';
      headline = 'Turn #' + this.props.turn.turn + ': ' + phase + ' Phase';
    }

    return headline;
  };

  render() {
    let current;

    if (this.props.turn.turn > 0) {
      current = <Turn turn={this.props.turn} />;
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
    turn: state.turn
  };
};

export default connect(mapStateToProps)(Layout);
