// models/question.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    grade: { type: DataTypes.INTEGER, allowNull: false },
    difficulty: { type: DataTypes.STRING, allowNull: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false }, // ["a","b","c","d"]
    answer: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.STRING, allowNull: true }
  });
};
