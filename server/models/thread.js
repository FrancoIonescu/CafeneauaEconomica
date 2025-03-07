const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Thread = sequelize.define("Thread", {
  id_thread: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nume_thread: { type: DataTypes.STRING(50), allowNull: false },
  data_creare: { type: DataTypes.DATE, allowNull: false },
  data_modificare: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'threaduri',
  timestamps: false 
});

module.exports = Thread;
