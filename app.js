const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyparser = require('body-parser');
const logger = require('morgan');
const socketIO = require('socket.io');
const http = require('http');
const models = require('./app/models');
const AccountRouter = require('./app/routes/AccountRoutes');
const DocumentRouter = require('./app/routes/DocumentRoutes');
const DocumentService = require('./app/services/DocumentService');
const documentService = new DocumentService();

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

app.use(AccountRouter);
app.use(DocumentRouter);

models.sequelize
  .sync()
  .then(function() {
    console.log('Nice! Database looks fine');
  })
  .catch(function(err) {
    console.log(err, 'Something went wrong with the Database Update!');
  });

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', client => {
  client.on('document-connect', async payload => {
    console.log(payload, client.id);

    const dataPayload = {
      userID: payload.userID,
      documentID: payload.documentID,
      socketID: client.id
    };

    await documentService.registerViewer(dataPayload);
    const activeViewers = await documentService.getActiveViewers(payload);
    io.emit(payload.documentID, activeViewers);
  });

  client.on('disconnect', async () => {
    const document = await documentService.removeActiveViewer(client.id);
    const activeViewers = await documentService.getActiveViewers({
      documentID: document.uuid
    });
    io.emit(document.uuid, activeViewers);
  });
});

server.listen(app.get('port'), () =>
  console.log(`Listening on port ${app.get('port')}`)
);

module.exports = server;
