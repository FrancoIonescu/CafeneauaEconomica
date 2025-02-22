const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Utilizator = require("./utilizator");

const Sanctiune = sequelize.define("Sanctiune", {
  id_sanctiune: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sanctiune: { type: DataTypes.TEXT, allowNull: false },
  durata_sanctiune: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'sanctiuni',
  timestamps: false 
});

Sanctiune.belongsTo(Utilizator, { foreignKey: "id_utilizator", onDelete: "CASCADE" });

module.exports = Sanctiune;
