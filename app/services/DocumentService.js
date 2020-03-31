const models = require('../models');
const { Op } = require('sequelize');
const { User, Document } = models;

const DocumentValidator = require('../validators/DocumentValidator');

class DocumentService {
  constructor() {
    this.documentValidator = new DocumentValidator();
  }

  async get(userID) {
    const documents = await Document.findAll({
      where: {
        [Op.or]: [
          {
            user_id: userID
          },
          {
            owner_id: userID
          }
        ]
      }
    });

    return documents;
  }

  async create(inputs) {
    let errors = await this.documentValidator.create(inputs);
    if (errors.length) {
      return { errors };
    }

    const { userID, name } = inputs;

    const documents = await Document.create({
      owner_id: userID,
      user_id: userID,
      name: name,
      public: false
    });

    return documents;
  }
}

module.exports = DocumentService;
