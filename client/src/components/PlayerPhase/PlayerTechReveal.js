import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './PlayerTechReveal.module.scss';

const playerTechReveal = props => (
  <Fragment>
    <p>What technologies have you shown?</p>
    <ul>
      <li>
        <label htmlFor="fightersSelector">Fighters:</label>
        <select
          id="fightersSelector"
          value={props.player.fighters}
          onChange={event => {
            props.playerTechUpdated(event.target.id, event.target.value);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </li>
      <li>
        <label htmlFor="pointDefenseSelector">Point Defense:</label>
        <select
          id="pointDefenseSelector"
          value={props.player.pointDefense}
          onChange={event => {
            props.playerTechUpdated(event.target.id, event.target.value);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </li>
      <li>
        <label htmlFor="cloakingSelector">Cloaking:</label>
        <select
          id="cloakingSelector"
          value={props.player.cloaking}
          onChange={event => {
            props.playerTechUpdated(event.target.id, event.target.value);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </li>
      <li>
        <label htmlFor="scannersSelector">Scanners:</label>
        <select
          id="scannersSelector"
          value={props.player.scanners}
          onChange={event => {
            props.playerTechUpdated(event.target.id, event.target.value);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </li>
      <li>
        <label htmlFor="minesSelector">Mines:</label>
        <select
          id="minesSelector"
          value={props.player.mines}
          onChange={event => {
            props.playerTechUpdated(event.target.id, event.target.value);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
        </select>
      </li>
      <li>
        <button className="advance" onClick={props.proceed}>
          Proceed
        </button>
      </li>
    </ul>
  </Fragment>
);

playerTechReveal.propTypes = {
  player: PropTypes.object.isRequired,
  playerTechUpdated: PropTypes.func.isRequired,
  proceed: PropTypes.func.isRequired
};

export default playerTechReveal;
