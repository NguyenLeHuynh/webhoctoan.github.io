// models/gameSession.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('GameSession', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.INTEGER },
    score: { type: DataTypes.INTEGER },
    rounds: { type: DataTypes.INTEGER },
    meta: { type: DataTypes.JSON }
  });
};
