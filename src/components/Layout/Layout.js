import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import GameSettings from '../GameSettings/GameSettings';
import AlienTechList from './AlienTechList';
import Turn from './Turn';

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
      <Fragment>
        <Header headline={this.displayHeadline()} />
        <main>{current}</main>
        {footer}
      </Fragment>
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
