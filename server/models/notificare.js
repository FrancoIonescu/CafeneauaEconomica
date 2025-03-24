const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Notificare = sequelize.define("Notificare", {
  id_notificare: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  mesaj: { type: DataTypes.TEXT, allowNull: false },
  data_notificare: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_utilizator: { type: DataTypes.INTEGER, allowNull: false}
}, {
  tableName: 'notificari',
  timestamps: false 
});

module.exports = Notificare;
