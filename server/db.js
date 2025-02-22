const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NUME, process.env.DB_UTILIZATOR, process.env.DB_PAROLA, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false
});

module.exports = sequelize;
