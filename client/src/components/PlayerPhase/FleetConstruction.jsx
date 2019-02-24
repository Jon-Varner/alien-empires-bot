import React from 'react';
import PropTypes from 'prop-types';

import Aux from '../../hoc/Auxiliary';
import Instructions from '../Messages/Instructions';

import classes from './FleetConstruction.module.scss';

const fleetConstruction = props => (
  <Aux>
    <p className={classes.fleetConstructor}>
      <span className={props.color}>{props.color}</span> Fleet #{props.fleetId}:
    </p>
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

fleetConstruction.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default fleetConstruction;
