import React from 'react';

const instructions = props => (
  <ol>
    {props.instructions.map((item, index) => (
      <React.Fragment key={index}>{item}</React.Fragment>
    ))}
  </ol>
);

export default instructions;
