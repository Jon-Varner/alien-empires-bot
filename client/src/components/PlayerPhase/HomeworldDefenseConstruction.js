import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Instructions from '../Messages/Instructions';

const homeworldDefenseConstruction = props => (
  <Fragment>
    <Instructions instructions={props.instructions} />
    <button
      className="advance"
      onClick={() => {
        props.homeworldDefenseConstructed();
      }}
    >
      Proceed
    </button>
  </Fragment>
);

homeworldDefenseConstruction.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default homeworldDefenseConstruction;
