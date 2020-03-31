'use strict';
module.exports = (sequelize, DataTypes) => {
  let Invite = sequelize.define(
    'Invite',
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      user_id: DataTypes.INTEGER,
      document_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Invite',
      tableName: 'invites',
      underscored: true
    }
  );

  Invite.associate = function(models) {};

  return Invite;
};
