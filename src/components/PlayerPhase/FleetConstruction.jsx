import React from 'react';

import Aux from '../../hoc/Auxiliary';

const fleetConstruction = props => (
  <Aux>
    <ol>
      {props.instructions.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </ol>
    <button onClick={props.proceedHandler}>Go to Econ Phase</button>
  </Aux>
);

export default fleetConstruction;
