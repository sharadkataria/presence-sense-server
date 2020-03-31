'use strict';
module.exports = (sequelize, DataTypes) => {
  let Document = sequelize.define(
    'Document',
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
      user_id: DataTypes.INTEGER,
      public: { type: DataTypes.BOOLEAN, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      sequelize,
      modelName: 'Document',
      tableName: 'documents',
      underscored: true
    }
  );

  Document.associate = function(models) {
    models.Document.belongsTo(models.User, {
      as: 'document_user',
      foreignKey: 'id',
      constraints: false
    });
  };

  return Document;
};
