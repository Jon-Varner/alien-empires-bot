import React from 'react';
import PropTypes from 'prop-types';

const userMenu = props => (
  <div className={`userMenu ${props.menuClass}`}>{/* form goes here */}</div>
);

userMenu.propTypes = {
  menuClass: PropTypes.string
};

export default userMenu;
