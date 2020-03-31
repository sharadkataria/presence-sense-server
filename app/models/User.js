'use strict';
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.TEXT('medium')
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true
    }
  );

  User.associate = function(models) {
    models.User.hasMany(models.Document, {
      as: 'user_documents',
      foreignKey: 'user_id',
      constraints: false
    });
  };

  return User;
};
