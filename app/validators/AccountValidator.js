const Validator = require('validator');
const models = require('../models');
const { User } = models;

class AccountValidator {
  async signup(inputs) {
    let errors = [];
    let { name, email, password } = inputs;
    if (!email || !Validator.isEmail(email)) {
      errors.push('Invalid email provided');
    }
    if (!name || Validator.isEmpty(name)) {
      errors.push('Invalid name provided');
    }
    if (!password || Validator.isEmpty(password) || password.length < 6) {
      errors.push('Password must be atleast 6 characters long.');
    }

    const user = await User.findOne({
      where: {
        email
      }
    });

    if (user) {
      errors.push('Email already exists.');
    }

    return errors;
  }

  async login(inputs) {
    let errors = [];
    let { email, password } = inputs;
    if (!email || !Validator.isEmail(email)) {
      errors.push('Invalid email provided');
    }

    if (!password || Validator.isEmpty(password)) {
      errors.push('Password is required');
    }

    return errors;
  }
}

module.exports = AccountValidator;
