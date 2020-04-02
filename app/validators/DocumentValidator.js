const Validator = require('validator');
const models = require('../models');
const { User } = models;

class DocumentValidator {
  async getByID(inputs) {
    let errors = [];
    let { documentID } = inputs;
    if (!documentID) {
      errors.push('Document ID is required.');
    }

    return errors;
  }

  async create(inputs) {
    let errors = [];
    let { userID, name } = inputs;
    if (!userID) {
      errors.push('Bad Request.');
    }
    if (!name) {
      errors.push('Name is required.');
    }

    return errors;
  }
}

module.exports = DocumentValidator;
