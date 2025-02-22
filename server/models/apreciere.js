const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Utilizator = require("./utilizator");
const Postare = require("./postare");
const Comentariu = require("./comentariu");

const Apreciere = sequelize.define("Apreciere", {
  id_apreciere: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_apreciere: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'aprecieri',
  timestamps: false 
});

Apreciere.belongsTo(Utilizator, { foreignKey: "id_utilizator", onDelete: "CASCADE" });
Apreciere.belongsTo(Postare, { foreignKey: "id_postare", onDelete: "CASCADE", allowNull: true });
Apreciere.belongsTo(Comentariu, { foreignKey: "id_comentariu", onDelete: "CASCADE", allowNull: true });

module.exports = Apreciere;
