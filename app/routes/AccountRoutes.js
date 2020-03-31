const AccountRouter = require('express').Router();
const AccountController = require('../controllers/AccountController');
const accountController = new AccountController();

AccountRouter.post('/login', accountController.login);

AccountRouter.post('/signup', accountController.signup);

module.exports = AccountRouter;
