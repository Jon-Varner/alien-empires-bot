import React from 'react';
import PropTypes from 'prop-types';

import classes from './Instructions.module.scss';

const instructions = props => (
  <div className={classes.instructions}>
    <ol>
      {props.instructions.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </ol>
  </div>
);

instructions.propTypes = {
  instructions: PropTypes.array.isRequired
};

export default instructions;
