import React from 'react';

import Aux from '../../hoc/Auxiliary';
import Instructions from '../Instructions/Instructions';

const fleetConstruction = props => (
  <Aux>
    <Instructions instructions={props.instructions} />
    <button
      className="advance"
      onClick={() => {
        props.fleetConstructed();
      }}
    >
      Proceed
    </button>
  </Aux>
);

export default fleetConstruction;
