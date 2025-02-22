const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Utilizator = require("./utilizator");
const Categorie = require("./categorie");

const Thread = sequelize.define("Thread", {
  id_thread: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nume_thread: { type: DataTypes.STRING(50), allowNull: false },
  data_creare: { type: DataTypes.DATE, allowNull: false },
  data_modificare: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'threaduri',
  timestamps: false 
});

Thread.belongsTo(Utilizator, { foreignKey: "id_utilizator", onDelete: "CASCADE" });
Thread.belongsTo(Categorie, { foreignKey: "id_categorie", onDelete: "CASCADE" });

module.exports = Thread;
