const accountRouter = require('express').Router();
const AccountController = require('../controllers/AccountController');
const accountController = new AccountController();

accountRouter.post('/login', accountController.login);

accountRouter.post('/signup', accountController.signup);

module.exports = accountRouter;
