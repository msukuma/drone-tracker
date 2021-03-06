import React, { Component } from 'react';
import {
  droneIndex,
  host,
  wssPort,
  webPort,
  clientsPath,
  dronesPath,
} from './shared';
import {
  Table,
  Container,
  Provider,
} from 'rendition';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drones: [],
      ready: false,
    };

    this.columns = [
      {
        field: 'id',
        label: 'Drone Id',
        sortable: true,
      },
      {
        field: 'location',
        label: 'Location',
        render: ({ lat, lon }) => `lat: ${lat}, lon: ${lon}`,
      },
      {
        field: 'speed',
        label: 'Speed (m/s)',
      },
      {
        field: 'moving',
        label: 'Status (past 10s)',
        sortable: true,
        render: s => s ? 'moving' : 'idling',
      },
    ];
  }

  componentDidMount () {
    this.getDevices()
      .then(() => this.initWebSocket());
  }

  getDevices () {
    return fetch(`http://${host}:${webPort}${dronesPath}`)
      .then(res => res.ok ? res.json() : res.json.then(err => Promise.reject(err)))
      .then(json => {
        if (json) {
          this.setState({
            drones: json.data,
            ready: true,
          });
        }
      })
      .catch(err => console.log(err));
  }

  initWebSocket () {
    const ws = new WebSocket(`ws://${host}:${wssPort}${clientsPath}`);

    ws.onopen = () => console.log('WebSocket connection open');
    ws.onmessage = (event) => {
      const drones = this.state.drones;
      const drone = JSON.parse(event.data);

      drones[droneIndex[drone.id]] = drone;
      this.setState({ drones: drones.slice() });
    };
  }

  render () {
    return (
      <div className="App">
        <Provider>
          <Container mt={ 50 }>
            <Table
              columns={ this.columns }
              data={ this.state.drones }
              rowKey={ 'id' }
            />
          </Container>
        </Provider>
      </div>
    );
  }
}

export default App;
