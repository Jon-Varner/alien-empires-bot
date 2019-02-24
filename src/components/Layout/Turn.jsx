import React from 'react';
import PropTypes from 'prop-types';

import PlayerPhase from '../PlayerPhase/PlayerPhase';
import AlienPhase from '../AlienPhase/AlienPhase';

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
