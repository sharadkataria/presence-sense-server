const UserTransformer = async users => {
  if (Array.isArray(users) && users.length) {
    for await (let user of users) {
      user.dataValues.id = user.dataValues.uuid;
      delete user.dataValues.uuid;
      delete user.dataValues.password;
    }
    return users;
  } else if (!Array.isArray(users) && users) {
    users.dataValues.id = users.dataValues.uuid;
    delete users.dataValues.uuid;
    delete users.dataValues.password;
    return users;
  } else return users;
};

module.exports = UserTransformer;
