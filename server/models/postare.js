const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Postare = sequelize.define("Postare", {
  id_postare: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  continut: { type: DataTypes.TEXT, allowNull: false },
  data_creare: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  data_modificare: { type: DataTypes.DATE },
  id_categorie: { type: DataTypes.INTEGER, allowNull: false },
  id_utilizator: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'postari',
  timestamps: false
});

module.exports = Postare;
