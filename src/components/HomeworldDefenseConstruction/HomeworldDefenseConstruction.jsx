import React from 'react';
import PropTypes from 'prop-types';

import Aux from '../../hoc/Auxiliary';
import Instructions from '../Instructions/Instructions';

const homeworldDefenseConstruction = props => (
  <Aux>
    <Instructions instructions={props.instructions} />
    <button
      className="advance"
      onClick={() => {
        props.homeworldDefenseConstructed();
      }}
    >
      Proceed
    </button>
  </Aux>
);

homeworldDefenseConstruction.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default homeworldDefenseConstruction;
