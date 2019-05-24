import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

const homeworldElimination = props => (
  <Fragment>
    <p>Did you destroy any homeworld?</p>
    <ul>
      {props.aliens.map(alien => (
        <li key={uuid.v4()}>
          <button
            className={alien.color}
            onClick={() => {
              props.homeworldEliminated(alien.id);
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
            props.proceed('no homeworld elimination');
          }}
        >
          No
        </button>
      </li>
    </ul>
  </Fragment>
);

homeworldElimination.propTypes = {
  aliens: PropTypes.array.isRequired,
  homeworldEliminated: PropTypes.func.isRequired,
  proceed: PropTypes.func.isRequired
};

export default homeworldElimination;
