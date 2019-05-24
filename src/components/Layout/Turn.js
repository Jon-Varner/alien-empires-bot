import React from 'react';
import PropTypes from 'prop-types';

import PlayerPhase from '../PlayerPhase/PlayerPhase';
import AlienPhase from '../AlienPhase/AlienPhase';

const Turn = props => {
  if (props.phase === 'alien') {
    return <AlienPhase />;
  }
  return <PlayerPhase />;
};

Turn.propTypes = {
  phase: PropTypes.string.isRequired
};

export default Turn;
