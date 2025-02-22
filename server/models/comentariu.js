const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Utilizator = require("./utilizator");
const Postare = require("./postare");

const Comentariu = sequelize.define("Comentariu", {
  id_comentariu: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  continut: { type: DataTypes.TEXT, allowNull: false },
  data_postarii: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'comentarii',
  timestamps: false 
});

Comentariu.belongsTo(Utilizator, { foreignKey: "id_utilizator", onDelete: "CASCADE" });
Comentariu.belongsTo(Postare, { foreignKey: "id_postare", onDelete: "CASCADE" });

module.exports = Comentariu;
