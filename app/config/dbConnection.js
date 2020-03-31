const DB = require('mysql');
const dbConfig = require('./dbConfig');
const connection = DB.createConnection(dbConfig);

module.exports = connection;
