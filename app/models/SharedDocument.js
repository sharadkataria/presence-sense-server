'use strict';
module.exports = (sequelize, DataTypes) => {
  let SharedDocument = sequelize.define(
    'SharedDocument',
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
      modelName: 'SharedDocument',
      tableName: 'shared_documents',
      underscored: true
    }
  );

  SharedDocument.associate = function(models) {};

  return SharedDocument;
};
