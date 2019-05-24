import React from 'react';
import PropTypes from 'prop-types';

import Register from '../Auth/Register';
import Login from '../Auth/Login';
import SaveAndLoad from '../GameSettings/SaveAndLoad';

const userMenu = props => (
  <div className={`userMenu ${props.menuClass}`}>
    <Login />
    <Register />
    {/*
    <SaveAndLoad
      games={props.games}
      loadGame={props.loadGame}
      saveGame={props.saveGame}
    />
    */}
  </div>
);

userMenu.propTypes = {
  menuClass: PropTypes.string
};

export default userMenu;
