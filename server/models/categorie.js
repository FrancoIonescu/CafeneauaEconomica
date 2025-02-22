const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Categorie = sequelize.define("Categorie", {
  id_categorie: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nume_categorie: { type: DataTypes.STRING(50), allowNull: false },
  descriere: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'categorii',
  timestamps: false 
});

module.exports = Categorie;
