const debug = require('debug')('web-server:server');
const ws = require('ws');
const url = require('url');
const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = app;
const webPort = 8000;
const { drones } = require('./shared');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', [
   'Accept',
   'Authorization',
   'Content-Type',
   'Origin',
   'X-Requested-With',
  ].join(', '));
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

app.use(express.static(join(__dirname, 'client', 'build')));

app.get('/', function (req, res) {
  res.sendFile(join(__dirname, 'client', 'build', 'index.html'));
});

app.get('/drones', function (req, res) {
  const data = drones.map(({ id, name, location: { current:location } }) => ({
    id,
    name,
    location,
  }));
  debug(data);
  res.json({ data });
});

app.listen(webPort, () => {
  debug(`API listening on port ${webPort}`);
});