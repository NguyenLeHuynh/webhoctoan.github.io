// models/attempt.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Attempt', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.INTEGER },
    type: { type: DataTypes.ENUM('quiz','game'), defaultValue: 'quiz' },
    grade: { type: DataTypes.INTEGER },
    score: { type: DataTypes.INTEGER },
    durationSec: { type: DataTypes.INTEGER },
    meta: { type: DataTypes.JSON }
  });
};
