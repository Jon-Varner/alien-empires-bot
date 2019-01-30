import React from 'react';

import PlayerPhase from '../../containers/PlayerPhase/PlayerPhase';
import AlienPhase from '../../containers/AlienPhase/AlienPhase';

import './Turn.module.scss';

const turn = props => {
  if (props.turn.phase === 'alien') {
    return <AlienPhase />;
  }
  return <PlayerPhase />;
};

export default turn;
