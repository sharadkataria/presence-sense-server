const UserTransformer = async users => {
  if (users.length) {
    for await (let user of users) {
      user.dataValues.id = user.dataValues.uuid;
      delete user.dataValues.uuid;
      delete user.dataValues.password;
    }
  } else if (users) {
    users.dataValues.id = users.dataValues.uuid;
    delete users.dataValues.uuid;
    delete users.dataValues.password;
    return users;
  } else return users;
};

module.exports = UserTransformer;
