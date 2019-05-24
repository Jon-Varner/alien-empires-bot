import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

const AlienTechList = props => (
  <footer className={props.footerClass}>
    <div
      className="toggler"
      onClick={() => {
        props.toggled();
      }}
    />
    <h2>Alien techs</h2>
    {props.aliens.map(alien => (
      <table key={uuid.v4()}>
        <thead>
          <tr>
            <th className={alien.color}>{alien.color}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Movement:</td>
            <td>{alien.movement}</td>
          </tr>
          <tr>
            <td>Attack:</td>
            <td>{alien.attack}</td>
          </tr>
          <tr>
            <td>Defense:</td>
            <td>{alien.defense}</td>
          </tr>
          <tr>
            <td>Tactics:</td>
            <td>{alien.tactics}</td>
          </tr>
          <tr>
            <td>Cloaking:</td>
            <td>{alien.cloaking}</td>
          </tr>
          <tr>
            <td>Fighters:</td>
            <td>{alien.fighters}</td>
          </tr>
          <tr>
            <td>Minesweeper:</td>
            <td>{alien.minesweeper}</td>
          </tr>
          <tr>
            <td>Point Defense:</td>
            <td>{alien.pointDefense}</td>
          </tr>
          <tr>
            <td>Scanners:</td>
            <td>{alien.scanners}</td>
          </tr>
        </tbody>
      </table>
    ))}
  </footer>
);

AlienTechList.propTypes = {
  aliens: PropTypes.array.isRequired,
  footerClass: PropTypes.string
};

export default AlienTechList;
