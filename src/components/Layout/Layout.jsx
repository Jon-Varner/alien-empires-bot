import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Header from './Header';
import GameSettings from '../../components/GameSettings/GameSettings';
import AlienTechList from './AlienTechList';
import Turn from '../Layout/Turn';

import * as actionTypes from '../../store/actions/types';

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

  toggleDrawerHandler = () => {
    this.props.toggleDrawer();
  };

  render() {
    let current;
    let footer;

    if (this.props.turn > 0) {
      current = <Turn phase={this.props.phase} />;
      footer = (
        <AlienTechList
          aliens={this.props.aliens}
          footerClass={this.props.footerClass}
          toggled={this.toggleDrawerHandler}
        />
      );
    } else {
      current = <GameSettings />;
    }

    return (
      <Aux>
        <Header headline={this.displayHeadline()} />
        <main>{current}</main>
        {footer}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    turn: state.turn.turn,
    phase: state.turn.phase,
    aliens: state.aliens.aliens,
    footerClass: state.interface.footerClass
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDrawer: () => {
      dispatch({ type: actionTypes.TOGGLE_DRAWER });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
