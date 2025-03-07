const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Comentariu = sequelize.define("Comentariu", {
  id_comentariu: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  continut: { type: DataTypes.TEXT, allowNull: false },
  data_postarii: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_utilizator: { type: DataTypes.INTEGER, allowNull: false },
  id_postare: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'comentarii',
  timestamps: false 
});

module.exports = Comentariu;
