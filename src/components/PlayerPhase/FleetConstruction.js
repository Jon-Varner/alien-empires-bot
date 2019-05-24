import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Instructions from '../Messages/Instructions';

import classes from './FleetConstruction.module.scss';

const FleetConstruction = props => (
  <Fragment>
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
  </Fragment>
);

FleetConstruction.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default FleetConstruction;
