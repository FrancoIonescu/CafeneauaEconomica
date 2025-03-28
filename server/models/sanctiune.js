const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Sanctiune = sequelize.define("Sanctiune", {
  id_sanctiune: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sanctiune: { type: DataTypes.TEXT, allowNull: false },
  durata_sanctiune: { type: DataTypes.DATE, allowNull: false },
  id_utilizator: { type: DataTypes.INTEGER, allowNull: false}
}, {
  tableName: 'sanctiuni',
  timestamps: false 
});

module.exports = Sanctiune;
