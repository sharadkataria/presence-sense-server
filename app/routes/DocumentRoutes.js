const DocumentRouter = require('express').Router();
const { authenticate } = require('../middlewares/Jwt');
const DocumentController = require('../controllers/DocumentController');
const documentController = new DocumentController();

DocumentRouter.post('/documents', authenticate(), documentController.create);

DocumentRouter.get('/documents/:documentID', documentController.getByID);

DocumentRouter.put(
  '/documents',
  authenticate(),
  documentController.updateSettings
);

DocumentRouter.get('/documents', authenticate(), documentController.get);

module.exports = DocumentRouter;
