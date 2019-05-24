import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Instructions from '../Messages/Instructions';

const HomeworldDefenseConstruction = props => (
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

HomeworldDefenseConstruction.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default HomeworldDefenseConstruction;
