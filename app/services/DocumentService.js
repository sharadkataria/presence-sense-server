const models = require('../models');
const sequelize = models.sequelize;
const { Op } = require('sequelize');
const { User, Document, SharedDocument, DocumentViewer } = models;
const moment = require('moment');
const DocumentValidator = require('../validators/DocumentValidator');

class DocumentService {
  constructor() {
    this.documentValidator = new DocumentValidator();
  }

  async get(userID) {
    let criteria = {
      where: {
        user_id: userID
      },
      order: [['created_at', 'desc']]
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
        [Op.or]: [
          {
            public: true
          },
          {
            id: document.id,
            user_id: userID
          }
        ]
      }
    });

    if (!accessDocument) {
      sharedDocument = await SharedDocument.findOne({
        where: { active: true, user_id: userID, document_id: document.id },
        attributes: ['id']
      });

      if (!sharedDocument) {
        errors.push('You dont have access to view this document.');
        return { errors };
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

      return await Document.findOne({
        where: {
          id: document.id
        }
      });
    }
  }

  async registerViewer(inputs) {
    const user = await User.findOne({
      where: {
        uuid: inputs.userID
      }
    });

    if (!user) {
      return null;
    }

    const document = await Document.findOne({
      where: {
        uuid: inputs.documentID
      }
    });

    if (!document) {
      return null;
    }

    await DocumentViewer.destroy({
      where: {
        user_id: user.id,
        document_id: document.id
      }
    });

    await DocumentViewer.create({
      active: true,
      user_id: user.id,
      document_id: document.id,
      socket_id: inputs.socketID
    });
  }

  async getActiveViewers(inputs) {
    const document = await Document.findOne({
      where: {
        uuid: inputs.documentID
      }
    });

    if (!document) {
      return null;
    }

    const activeViewers = await sequelize.query(
      `select dv.active as active, dv.user_id, dv.document_id, dv.created_at as createdAt, dv.updated_at, u.uuid as userID, u.name as userName, u.email as userEmail from document_viewers dv join users u on dv.user_id = u.id where dv.document_id = ${document.id} order by dv.updated_at desc`,
      {
        type: sequelize.QueryTypes.SELECT,
        logging: console.log
      }
    );

    if (!activeViewers.length) {
      return [];
    } else {
      let payload = [];
      for (let viewer of activeViewers) {
        payload.push({
          id: viewer.userID,
          avatar: viewer.userName.charAt(0).toUpperCase(),
          name: viewer.userName,
          email: viewer.userEmail,
          timestamp: moment(viewer.createdAt).format('DD MMM, YYYY HH:mm A'),
          active: viewer.active ? true : false
        });
      }
      return payload;
    }
  }

  async removeActiveViewer(socketID) {
    const viewDocument = await DocumentViewer.findOne({
      where: {
        socket_id: socketID
      }
    });

    await DocumentViewer.update(
      {
        active: false
      },
      {
        where: {
          id: viewDocument.id
        }
      }
    );

    return await Document.findOne({
      where: {
        id: viewDocument.document_id
      },
      attributes: ['uuid']
    });
  }
}

module.exports = DocumentService;
