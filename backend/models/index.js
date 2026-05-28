"use strict";
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models here
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Document = require('./document')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Document, { foreignKey: 'userId', as: 'documents', onDelete: 'CASCADE' });
db.Document.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
