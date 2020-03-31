'use strict';
module.exports = (sequelize, DataTypes) => {
  let DocumentViewer = sequelize.define(
    'DocumentViewer',
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
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      user_id: DataTypes.INTEGER,
      document_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'DocumentViewer',
      tableName: 'document_viewers',
      underscored: true
    }
  );

  DocumentViewer.associate = function(models) {};

  return DocumentViewer;
};
