const jwt = require('jsonwebtoken');
const DocumentTransformer = require('../transformers/DocumentTransformer');
const { getUser } = require('../middlewares/Jwt');
const DocumentService = require('../services/DocumentService');
const documentService = new DocumentService();

class DocumentController {
  async get(req, res) {
    const user = await getUser(req, res);
    const result = await documentService.get(user);
    let documents = await DocumentTransformer(result);
    res.send(documents);
  }

  async getByID(req, res) {
    const user = await getUser(req, res);
    const result = await documentService.getByID({
      ...req.params,
      userID: user
    });
    if (result.errors) {
      return res.status(400).send(result.errors);
    }
    let documents = await DocumentTransformer(result);
    res.send(documents);
  }

  async updateSettings(req, res) {
    const user = await getUser(req, res);
    const result = await documentService.updateSettings({
      ...req.body,
      userID: user
    });
    if (result.errors) {
      return res.status(400).send(result.errors);
    }
    let documents = await DocumentTransformer(result);
    res.send(documents);
  }

  async create(req, res) {
    const user = await getUser(req, res);
    const result = await documentService.create({ ...req.body, userID: user });
    if (result.errors) {
      return res.status(400).send(result.errors);
    }
    let documents = await DocumentTransformer(result);
    res.send(documents);
  }
}

module.exports = DocumentController;
