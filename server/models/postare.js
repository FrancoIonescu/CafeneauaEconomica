const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Postare = sequelize.define("Postare", {
  id_postare: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  continut: { type: DataTypes.TEXT, allowNull: false },
  data_creare: { type: DataTypes.DATE, allowNull: false },
  data_modificare: { type: DataTypes.DATE }
}, {
  tableName: 'postari',
  timestamps: false 
});

module.exports = Postare;
