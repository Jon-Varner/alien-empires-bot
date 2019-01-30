import React from 'react';

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

export default instructions;
