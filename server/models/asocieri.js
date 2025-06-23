const Utilizator = require('./utilizator');
const Postare = require('./postare');
const Comentariu = require('./comentariu');
const Apreciere = require('./apreciere');
const Categorie = require('./categorie');
const Notificare = require('./notificare');
const Sanctiune = require('./sanctiune');
const Stire = require('./stire');

Utilizator.hasMany(Postare, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'postari' });
Utilizator.hasMany(Comentariu, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'comentarii' });
Utilizator.hasMany(Apreciere, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'aprecieri' });
Utilizator.hasMany(Notificare, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'notificari' });
Utilizator.hasMany(Sanctiune, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'sanctiuni' });
Utilizator.hasMany(Stire, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'stiri' });

Postare.belongsTo(Utilizator, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'utilizator'});
Postare.belongsTo(Categorie, { foreignKey: 'id_categorie', onDelete: 'CASCADE', as: 'categorie'});
Postare.hasMany(Comentariu, { foreignKey: 'id_postare', onDelete: 'CASCADE', as: 'comentarii' });
Postare.hasMany(Apreciere, { foreignKey: 'id_postare', onDelete: 'CASCADE', as: 'aprecieri' });

Comentariu.belongsTo(Utilizator, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'utilizator' });
Comentariu.belongsTo(Postare, { foreignKey: 'id_postare', onDelete: 'CASCADE', as: 'postare' });
Comentariu.hasMany(Apreciere, { foreignKey: 'id_comentariu', onDelete: 'CASCADE', as: 'aprecieri' });

Apreciere.belongsTo(Utilizator, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'utilizator' });
Apreciere.belongsTo(Postare, { foreignKey: 'id_postare', onDelete: 'CASCADE', allowNull: true, as: 'postare' });
Apreciere.belongsTo(Comentariu, { foreignKey: 'id_comentariu', onDelete: 'CASCADE', allowNull: true, as: 'comentariu' });

Categorie.hasMany(Postare, { foreignKey: 'id_categorie', onDelete: 'CASCADE', as: 'postari' });

Notificare.belongsTo(Utilizator, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'utilizator' });

Sanctiune.belongsTo(Utilizator, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'utilizator' });

Stire.belongsTo(Utilizator, { foreignKey: 'id_utilizator', onDelete: 'CASCADE', as: 'utilizator' });

module.exports = {
    Utilizator,
    Postare,
    Comentariu,
    Apreciere,
    Categorie,
    Notificare,
    Sanctiune
};