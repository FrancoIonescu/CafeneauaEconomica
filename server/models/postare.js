const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Utilizator = require("./utilizator");
const Categorie = require("./categorie");

const Postare = sequelize.define("Postare", {
  id_postare: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  continut: { type: DataTypes.TEXT, allowNull: false },
  data_creare: { type: DataTypes.DATE, allowNull: false },
  data_modificare: { type: DataTypes.DATE }
}, {
  tableName: 'postari',
  timestamps: false 
});

Postare.belongsTo(Utilizator, { foreignKey: "id_utilizator", onDelete: "CASCADE" });
Postare.belongsTo(Categorie, { foreignKey: "id_categorie", onDelete: "CASCADE" });

module.exports = Postare;
