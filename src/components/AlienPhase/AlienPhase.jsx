import React from 'react';

import Aux from '../../hoc/Auxiliary';

import './AlienPhase.module.scss';

const fleetEncountered = index => {
  console.log('Encountered the ' + index + ' fleet.');
};

const alienPhase = props => {
  return (
    <Aux>
      <p>Did you encounter an alien fleet?</p>
      <ul>
        {props.opponents.map((opponent, index) => (
          <li key={index} id={opponent.id} onClick={fleetEncountered(index)}>
            {opponent.color}
          </li>
        ))}
      </ul>
    </Aux>
  );
};

export default alienPhase;
