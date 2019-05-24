import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

class FleetEncounter extends Component {
  state = {
    fleets: []
  };

  componentDidMount() {
    const aliens = [...this.props.aliens];
    const allFleets = [];

    for (const alien of aliens) {
      const fleets = [...alien.fleets];

      for (const fleet of fleets) {
        if (!fleet.encountered) {
          allFleets.push({
            color: alien.color,
            alienId: alien.id,
            fleetId: fleet.id
          });
        }
      }
    }

    this.setState({ fleets: allFleets });
  }

  render() {
    return (
      <Fragment>
        <p>Did you encounter an unbuilt alien fleet?</p>
        <ul>
          {this.state.fleets.map(fleet => (
            <li key={uuid.v4()}>
              <button
                className={fleet.color}
                onClick={() => {
                  this.props.fleetEncountered(fleet.alienId, fleet.fleetId);
                }}
              >
                {fleet.color} Fleet #{fleet.fleetId}
              </button>
            </li>
          ))}

          <li>
            <button
              className="advance"
              onClick={() => {
                this.props.proceed('no fleet encounter');
              }}
            >
              No
            </button>
          </li>
        </ul>
      </Fragment>
    );
  }
}

FleetEncounter.propTypes = {
  aliens: PropTypes.array.isRequired,
  fleetEncountered: PropTypes.func.isRequired,
  proceed: PropTypes.func.isRequired
};

export default FleetEncounter;
