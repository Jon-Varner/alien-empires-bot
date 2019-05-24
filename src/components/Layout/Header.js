import React from 'react';
import PropTypes from 'prop-types';

import './Header.module.scss';

const Header = props => (
  <header>
    <h1>{props.headline}</h1>
  </header>
);

Header.propTypes = {
  headline: PropTypes.string.isRequired
};

export default Header;
