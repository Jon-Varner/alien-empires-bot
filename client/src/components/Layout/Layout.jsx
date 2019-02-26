import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Header from './Header';
import Nav from './Nav';
import UserMenu from './UserMenu';
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

  onToggleUserMenu = () => {
    this.props.toggle('user menu');
  };

  onToggleFooter = () => {
    this.props.toggle('footer');
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
          toggled={this.onToggleFooter}
        />
      );
    } else {
      current = <GameSettings />;
    }

    return (
      <Aux>
        <Header headline={this.displayHeadline()} />
        <Nav toggled={this.onToggleUserMenu} />
        <UserMenu menuClass={this.props.menuClass} />
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
    menuClass: state.interface.menuClass,
    footerClass: state.interface.footerClass
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle: target => {
      dispatch({
        type: actionTypes.TOGGLE,
        payload: {
          target: target
        }
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
