const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Stire = sequelize.define("Stire", {
    id_stire: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titlu: { type: DataTypes.STRING, allowNull: false },
    continut: { type: DataTypes.TEXT, allowNull: false },
    imagine_stire: { type: DataTypes.STRING, allowNull: false },
    data_creare: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    id_utilizator: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'stiri',
    timestamps: false
});

module.exports = Stire;