import React from 'react';

import Aux from '../../hoc/Auxiliary';

const homeworldInvasion = props => (
  <Aux>
    <p>Did you invade an alien homeworld?</p>
    <ul>
      {props.aliens.map((alien, index) => (
        <li key={index}>
          <button
            className={alien.color}
            onClick={() => {
              props.homeworldInvaded(alien.id);
            }}
          >
            {alien.color}
          </button>
        </li>
      ))}

      <li>
        <button
          className="advance"
          onClick={() => {
            props.proceed('no homeworld invasion');
          }}
        >
          No
        </button>
      </li>
    </ul>
  </Aux>
);

export default homeworldInvasion;
