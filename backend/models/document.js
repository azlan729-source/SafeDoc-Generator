"use strict";
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmptyJson(value) {
          if (value == null) {
            throw new Error('Content must be a non-empty JSON object or array');
          }
          if (Array.isArray(value) && value.length === 0) {
            throw new Error('Content must be a non-empty JSON object or array');
          }
          if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
            throw new Error('Content must be a non-empty JSON object or array');
          }
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'documents',
    timestamps: true,
  });

  return Document;
};
