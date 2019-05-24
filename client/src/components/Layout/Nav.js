import React from 'react';
import PropTypes from 'prop-types';

import gearIcon from '../../assets/gear.svg';

const nav = props => (
  <nav>
    <div
      className="userToggle"
      onClick={() => {
        props.toggled('user menu');
      }}
    >
      <img src={gearIcon} alt="user menu toggle" />
    </div>
  </nav>
);

nav.propTypes = {
  toggled: PropTypes.func.isRequired
};

export default nav;
