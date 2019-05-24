import React from 'react';
import PropTypes from 'prop-types';

import './Header.module.scss';

const header = props => (
  <header>
    <h1>{props.headline}</h1>
  </header>
);

header.propTypes = {
  headline: PropTypes.string.isRequired
};

export default header;
