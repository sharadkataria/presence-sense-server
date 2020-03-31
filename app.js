const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyparser = require('body-parser');
const logger = require('morgan');
const socketIO = require('socket.io');
const http = require('http');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, OPTIONS, PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  next();
});

app.use(logger('dev'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3003);

const server = http.createServer(app);
const io = socketIO(server);

server.listen(app.get('port'), () =>
  console.log(`Listening on port ${app.get('port')}`)
);

module.exports = server;
