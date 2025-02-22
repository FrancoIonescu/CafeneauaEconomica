const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Utilizator = require("./utilizator");

const Notificare = sequelize.define("Notificare", {
  id_notificare: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  mesaj: { type: DataTypes.TEXT, allowNull: false },
  citit: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  tableName: 'notificari',
  timestamps: false 
});

Notificare.belongsTo(Utilizator, { foreignKey: "id_utilizator", onDelete: "CASCADE" });

module.exports = Notificare;
