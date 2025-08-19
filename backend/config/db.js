// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DATABASE_DIALECT || 'sqlite';
let sequelize;

if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || './database.sqlite',
    logging: false
  });
} else {
  // Example for Postgres: set DATABASE_URL env variable
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
  });
}

module.exports = sequelize;
