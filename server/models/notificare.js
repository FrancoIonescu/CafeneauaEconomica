const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Notificare = sequelize.define("Notificare", {
  id_notificare: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  mesaj: { type: DataTypes.TEXT, allowNull: false },
  citit: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  tableName: 'notificari',
  timestamps: false 
});

module.exports = Notificare;
