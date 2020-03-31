const models = require('../models');
const { Op } = require('sequelize');
const { User, Document, SharedDocument } = models;

const DocumentValidator = require('../validators/DocumentValidator');

class DocumentService {
  constructor() {
    this.documentValidator = new DocumentValidator();
  }

  async get(userID) {
    let criteria = {
      where: {
        user_id: userID
      }
    };

    const sharedDocuments = await SharedDocument.findAll({
      where: { active: true, user_id: userID },
      attributes: ['id']
    });

    if (sharedDocuments.length) {
      let sharedDocumentsIDs = [];
      for (let doc of sharedDocuments) {
        sharedDocumentsIDs.push(doc.id);
      }

      criteria.where = {
        [Op.or]: [
          {
            user_id: userID
          },
          {
            id: {
              [Op.in]: sharedDocumentsIDs
            }
          }
        ]
      };
    }

    const documents = await Document.findAll(criteria);

    return documents;
  }

  async getByID(inputs) {
    let errors = await this.documentValidator.getByID(inputs);

    const { documentID, userID } = inputs;
    const document = await Document.findOne({
      where: {
        [Op.or]: [
          {
            uuid: documentID
          },
          {
            public: true
          }
        ]
      }
    });

    if (!document) {
      errors.push('Document doesnt exist.');
      return { errors };
    }

    let sharedDocument = null;
    const accessDocument = await Document.findOne({
      where: {
        id: document.id,
        user_id: userID
      }
    });

    if (!accessDocument) {
      sharedDocument = await SharedDocument.findOne({
        where: { active: true, user_id: userID, document_id: document.id },
        attributes: ['id']
      });

      if (!sharedDocument) {
        errors.push('You dont have access to view this document.');
      }
    }

    return document;
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

  async updateSettings(inputs) {
    const { userID, documentID, publicCheck, emails } = inputs;

    const document = await Document.findOne({
      where: {
        user_id: userID,
        document_id: documentID
      }
    });

    if (!document) {
      errors.push('You dont have access to perform this operation.');
      return { errors };
    }

    if (publicCheck && publicCheck == true) {
      await Document.update(
        {
          public: true
        },
        {
          where: {
            id: document.id
          }
        }
      );

      return await Document.findOne({
        where: {
          document_id: document.id
        }
      });
    } else {
      await Document.update(
        {
          public: false
        },
        {
          where: {
            id: document.id,
            active: true
          }
        }
      );

      if (!emails || !emails.length) {
        await SharedDocument.update(
          {
            active: false
          },
          {
            where: {
              document_id: document.id
            }
          }
        );
      } else {
        const users = await User.findAll({
          where: {
            emails: {
              [Op.in]: emails
            }
          },
          attributes: ['id']
        });

        if (users.length) {
          let userData = [];
          for (let user of users) {
            userData.push({
              active: true,
              document_id: document.id,
              user_id: user.id
            });
          }

          await SharedDocument.bulkCreate(userData);
        }
      }
    }
  }
}

module.exports = DocumentService;
