const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const User = require('./User');
const Document = require('./Document');
const Invite = require('./Invite');
const DocumentViewer = require('./DocumentViewer');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,
    timezone: '+05:30',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    logging: console.log
  }
);

let models = {
  User,
  DocumentViewer,
  Document,
  Invite
};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
