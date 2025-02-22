const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Utilizator = sequelize.define('Utilizator', {
    id_utilizator: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nume_utilizator: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    parola: { type: DataTypes.STRING, allowNull: false },
    data_inregistrare: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_nastere: { type: DataTypes.DATE, allowNull: true },
    este_moderator: { type: DataTypes.BOOLEAN, defaultValue: false },
    imagine_profil: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'utilizatori',
    timestamps: false 
});

module.exports = Utilizator;
