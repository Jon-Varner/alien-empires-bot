import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

const HomeworldInvasion = props => (
  <Fragment>
    <p>Did you invade an alien homeworld?</p>
    <ul>
      {props.aliens.map(alien => (
        <li key={uuid.v4()}>
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
  </Fragment>
);

HomeworldInvasion.propTypes = {
  aliens: PropTypes.array.isRequired,
  homeworldInvaded: PropTypes.func.isRequired,
  proceed: PropTypes.func.isRequired
};

export default HomeworldInvasion;
