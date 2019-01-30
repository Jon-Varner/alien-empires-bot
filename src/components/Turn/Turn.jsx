import React from 'react';
import PropTypes from 'prop-types';

import PlayerPhase from '../../containers/PlayerPhase/PlayerPhase';
import AlienPhase from '../../containers/AlienPhase/AlienPhase';

import './Turn.module.scss';

const turn = props => {
  if (props.phase === 'alien') {
    return <AlienPhase />;
  }
  return <PlayerPhase />;
};

turn.propTypes = {
  phase: PropTypes.string.isRequired
};

export default turn;
