const jwt = require('jsonwebtoken');
const AccountService = require('../services/AccountService');
const UserTransformer = require('../transformers/UserTransformer');
const accountService = new AccountService();

class AccountController {
  async login(req, res) {
    const result = await accountService.login(req.body);
    if (result.errors) {
      return res.status(400).send(result.errors);
    }
    const accessToken = jwt.sign({ id: result.id }, process.env.JWT_SECRET);
    let users = await UserTransformer(result);
    users = users.dataValues;
    users['access_token'] = accessToken;
    users['token_tye'] = 'Bearer';

    res.send(users);
  }

  async signup(req, res) {
    const result = await accountService.signup(req.body);
    if (result.errors) {
      return res.status(400).send(result.errors);
    }

    const accessToken = jwt.sign({ id: result.id }, process.env.JWT_SECRET);
    let users = await UserTransformer(result);
    users = users.dataValues;
    users['access_token'] = accessToken;
    users['token_tye'] = 'Bearer';
    res.send(users);
  }
}

module.exports = AccountController;
