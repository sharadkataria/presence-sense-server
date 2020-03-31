const bcrypt = require('bcrypt');
const models = require('../models');
const sequelize = models.sequelize;
const { User } = models;

const AccountValidator = require('../validators/AccountValidator');

class AccountService {
  constructor() {
    this.accountValidator = new AccountValidator();
  }

  async login(inputs) {
    let errors = await this.accountValidator.login(inputs);
    if (errors.length) {
      return { errors };
    }

    const { email, password } = inputs;

    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      errors.push('Invalid details provided');
      return { errors };
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      errors.push('Invalid details provided');
      return { errors };
    }

    return user;
  }

  async signup(inputs) {
    let errors = await this.accountValidator.signup(inputs);
    if (errors.length) {
      return { errors };
    }

    const { name, email, password } = inputs;

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return user;
  }
}

module.exports = AccountService;
