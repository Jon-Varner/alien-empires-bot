import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';

class FleetEncounter extends Component {
  state = {
    fleets: []
  };

  componentDidMount() {
    const aliens = [...this.props.aliens];
    const allFleets = [];

    aliens.forEach(alien => {
      const fleets = [...alien.fleets];

      fleets.forEach(fleet => {
        allFleets.push({
          color: alien.color,
          alienId: alien.id,
          fleetId: fleet.id,
          fleetCp: fleet.cp
        });
      });
    });

    console.log('All fleets=');
    console.log(allFleets);

    this.setState({ fleets: allFleets });
  }

  render() {
    return (
      <Aux>
        <p>Did you encounter an unbuilt alien fleet?</p>
        <ul>
          {this.state.fleets.map((fleet, index) => (
            <li key={index}>
              <button
                className={fleet.color}
                onClick={() => {
                  this.props.fleetEncountered(
                    fleet.alienId,
                    fleet.fleetId,
                    fleet.fleetCp,
                    fleet.color
                  );
                }}
              >
                {fleet.color} Fleet #{fleet.fleetId}
              </button>
            </li>
          ))}

          <li>
            <button className="advance" onClick={this.props.proceed}>
              No
            </button>
          </li>
        </ul>
      </Aux>
    );
  }
}

export default FleetEncounter;
