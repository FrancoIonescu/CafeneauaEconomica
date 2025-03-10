const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Apreciere = sequelize.define("Apreciere", {
  id_apreciere: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_apreciere: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_postare: { type: DataTypes.INTEGER, allowNull: true },
  id_comentariu: { type: DataTypes.INTEGER, allowNull: true },
  id_utilizator: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'aprecieri',
  timestamps: false
});

module.exports = Apreciere;