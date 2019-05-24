import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import classes from './Instructions.module.scss';

const Instructions = props => (
  <div className={classes.instructions}>
    <ol>
      {props.instructions.map(item => (
        <React.Fragment key={uuid.v4()}>{item}</React.Fragment>
      ))}
    </ol>
  </div>
);

Instructions.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default Instructions;
