import React from 'react';

import PlayerPhase from '../PlayerPhase/PlayerPhase';
import AlienPhase from '../AlienPhase/AlienPhase';

import './Turn.module.scss';

const turn = props => {
  if (props.turn.phase === 'alien') {
    return <AlienPhase />;
  }
  return <PlayerPhase />;
};

export default turn;
