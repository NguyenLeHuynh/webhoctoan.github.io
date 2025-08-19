// models/index.js
const sequelize = require('../config/db');
const User = require('./user');
const Question = require('./question');
const Attempt = require('./attempt');
const GameSession = require('./gameSession');

// Initialize models with sequelize
const models = {
  User: User(sequelize),
  Question: Question(sequelize),
  Attempt: Attempt(sequelize),
  GameSession: GameSession(sequelize)
};

// Relations (simple)
models.Attempt.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
models.GameSession.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });

async function syncModels() {
  await sequelize.sync(); // for production consider migrations
}

module.exports = { ...models, sequelize, syncModels };
