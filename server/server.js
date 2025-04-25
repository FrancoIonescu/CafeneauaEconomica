const express = require('express');
const sequelize = require('./db');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const Utilizator = require('./models/utilizator'); 
const Notificare = require('./models/notificare');
const Postare = require('./models/postare');
const Sanctiune = require('./models/sanctiune');
const Categorie = require('./models/categorie');
const Apreciere = require('./models/apreciere');
const Comentariu = require('./models/comentariu');
const Stire = require('./models/stire');
const Asocieri = require('./models/asocieri')
const session = require('express-session'); 
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static(__dirname));
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,         
    saveUninitialized: true,  
    cookie: { secure: false } 
}));

app.get('/sesiune', (req, res) => {
    if (req.session.id_utilizator) {        
        res.json({ 
                   id_utilizator: req.session.id_utilizator,
                   nume_utilizator: req.session.nume_utilizator, 
                   email: req.session.email, 
                   este_moderator: req.session.este_moderator,
                   imagine_profil: req.session.imagine_profil
                });
    } else {
        res.status(401).json({ message: 'Nu ești logat' });
    }
});

app.post('/inregistrare', async (req, res) => {
    const { nume_utilizator, email, parola, data_nastere } = req.body;

    try {
        const numeUtilizatorDejaExistent = await Utilizator.findOne({ where: { nume_utilizator } });
        const emailDejaExistent = await Utilizator.findOne({ where: { email } });

        if (emailDejaExistent) {
            return res.status(400).json({ message: 'Emailul este deja folosit!' });
        }

        if (numeUtilizatorDejaExistent) {
            return res.status(400).json({ message: 'Numele de utilizator este deja folosit!' });
        }

        if (parola.length < 10) {
            return res.status(400).json({ message: 'Parola trebuie să aibă cel puțin 10 caractere!' });
        }

        const salt = await bcrypt.genSalt(12);
        const parolaHash = await bcrypt.hash(parola, salt);

        const utilizatorNou = await Utilizator.create({
            nume_utilizator,
            email,
            parola: parolaHash, 
            data_nastere
        });

        await Notificare.create({
            id_utilizator: utilizatorNou.id_utilizator,
            mesaj: 'Bun venit în Cafeneaua Economică!'
        });

        req.session.id_utilizator = utilizatorNou.id_utilizator;  
        req.session.nume_utilizator = utilizatorNou.nume_utilizator;
        req.session.email = utilizatorNou.email;
        req.session.este_moderator = utilizatorNou.este_moderator;
        req.session.imagine_profil = utilizatorNou.imagine_profil;

        res.status(201).json({
            message: 'Cont creat cu succes',
            id_utilizator: utilizatorNou.id_utilizator,
            email: utilizatorNou.email
        });

    } catch (err) {
        console.error('Eroare la înregistrare:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

const incercariAutentificare = new Map();
const LIMITA_INCERCARI = 5;
const TIMP_BLOCARE_MS = 30 * 60 * 1000; 

app.post('/conectare', async (req, res) => {
    const { email, parola } = req.body;
    const adresaIP = req.ip; 
    
    const incercari = incercariAutentificare.get(adresaIP) || { count: 0, ultimaIncercare: null };

    const acum = Date.now();
    if (incercari.count >= LIMITA_INCERCARI && (acum - incercari.ultimaIncercare) < TIMP_BLOCARE_MS) {
        const timpRamas = Math.ceil((TIMP_BLOCARE_MS - (acum - incercari.ultimaIncercare)) / 60000);
        return res.status(429).json({ message: `Prea multe încercări. Reîncearcă peste ${timpRamas} minute.` });
    }

    try {
        const utilizator = await Utilizator.findOne({ where: { email } });

        if (!utilizator) {
            throw new Error("Email sau parolă incorectă!");
        }

        const parolaCorecta = await bcrypt.compare(parola, utilizator.parola);

        if (!parolaCorecta) {
            throw new Error("Email sau parolă incorectă!");
        }

        incercariAutentificare.delete(adresaIP);

        req.session.id_utilizator = utilizator.id_utilizator;
        req.session.nume_utilizator = utilizator.nume_utilizator;
        req.session.email = utilizator.email;
        req.session.este_moderator = utilizator.este_moderator;
        req.session.imagine_profil = utilizator.imagine_profil;

        return res.json({
            id_utilizator: utilizator.id_utilizator,
            email: utilizator.email,
            data_inregistrare: utilizator.data_inregistrare,
            este_moderator: utilizator.este_moderator
        });

    } catch (err) {
        const contor = {
            count: incercari.count + 1,
            ultimaIncercare: Date.now()
        };
        incercariAutentificare.set(adresaIP, contor); 

        console.error('Eroare la autentificare:', err);
        return res.status(401).json({ message: 'Email sau parolă incorectă!' });
    }
});

app.post('/deconectare', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Eroare la deconectare' });
        }
        res.status(200).json({ message: 'Logout cu succes' });
    });
});

app.get('/utilizatori', async (req, res) => {
    try {
        const utilizatori = await Utilizator.findAll({
            attributes: ['id_utilizator', 'nume_utilizator', 'imagine_profil'],
            include: [{
                model: Sanctiune,
                as: 'sanctiuni', 
                attributes: ['id_sanctiune', 'sanctiune', 'durata_sanctiune']
            }]
        });

        res.json(utilizatori);
    } catch (err) {
        console.error('Eroare la obținerea utilizatorilor cu sancțiuni:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.delete('/utilizatori', async (req, res) => {
    const { id_utilizator } = req.body;

    try {
        await Utilizator.destroy({ where: { id_utilizator } });

        res.json({ message: 'Utilizator șters cu succes' });
    } catch (err) {
        console.error('Eroare la ștergerea utilizatorului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.post('/sanctiuni', async (req, res) => {
    const { id_utilizator, sanctiune, durata_sanctiune } = req.body;

    try {
        if (!id_utilizator) {
            return res.status(400).json({ message: 'Lipsește id-ul utilizatorului' });
        }

        await Sanctiune.create({
            sanctiune,
            durata_sanctiune, 
            id_utilizator
        });

        res.json({ message: 'Utilizator sancționat cu succes' });
    } catch (err) {
        console.error('Eroare la sancționarea utilizatorului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.delete('/sanctiuni', async (req, res) => {
    const { id_sanctiune } = req.body;

    try {
        await Sanctiune.destroy({ where: { id_sanctiune } });

        res.json({ message: 'Sancțiune ștearsă cu succes' });
    } catch (err) {
        console.error('Eroare la ștergerea sancțiunii:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.get('/profil/:id', async (req, res) => {
    const idCautat = req.params.id;
    const esteProfilPropriu = parseInt(idCautat) === req.session.id_utilizator;

    if (!req.session || !req.session.id_utilizator) {
        return res.status(401).json({ mesaj: 'Utilizator neautentificat' });
    }

    try {
        const utilizator = await Utilizator.findOne({
            where: { id_utilizator: idCautat },
            attributes: [
                'id_utilizator',
                'imagine_profil',
                'nume_utilizator',
                'email',
                'data_nastere',
                'descriere',
                'varsta',
                'oras',
                'ocupatie'
            ]
        });

        if (!utilizator) {
            return res.status(404).json({ mesaj: 'Utilizatorul nu a fost găsit' });
        }

        let sanctiuni = [];

        if (esteProfilPropriu) {
            sanctiuni = await Sanctiune.findAll({
                where: { id_utilizator: idCautat },
                attributes: ['sanctiune', 'durata_sanctiune'],
                order: [['id_sanctiune', 'DESC']]
            });
        }

        res.json({ utilizator, sanctiuni, esteProfilPropriu });
    } catch (error) {
        console.error('Eroare la obținerea profilului:', error);
        res.status(500).json({ mesaj: 'Eroare de server' });
    }
});

app.put('/profil', async (req, res) => {
    try {
        if (req.body.imagine_profil) {
            await Utilizator.update({ imagine_profil: req.body.imagine_profil }, { where: { id_utilizator: req.session.id_utilizator } });
        }

        await Utilizator.update(req.body, { where: { id_utilizator: req.session.id_utilizator } });

        res.json({ message: 'Profil actualizat cu succes!' });
    } catch (error) {
        console.error('Eroare la actualizarea profilului:', error);
        res.status(500).json({ message: 'Eroare la actualizarea profilului.' });
    }
});

app.get('/notificari', async (req, res) => {
    if (!req.session || !req.session.id_utilizator) {
        return res.status(401).json({ mesaj: 'Utilizator neautentificat' });
    }

    try {
        const notificari = await Notificare.findAll({
            where: { id_utilizator: req.session.id_utilizator },
            order: [['data_notificare', 'DESC']]
        });

        res.json(notificari);
    } catch (error) {
        console.error('Eroare la obținerea notificărilor:', error);
        res.status(500).json({ mesaj: 'Eroare de server' });
    }
});

app.delete('/notificari', async (req, res) => {
    const { id_notificare } = req.body;

    if (!req.session || !req.session.id_utilizator) {
        return res.status(401).json({ mesaj: 'Utilizator neautentificat' });
    }

    try {
        await Notificare.destroy({ where: { id_notificare: id_notificare } });
        res.json({ mesaj: 'Notificare ștearsă cu succes' });
    } catch (error) {
        console.error('Eroare la ștergerea notificării:', error);
        res.status(500).json({ mesaj: 'Eroare de server' });
    }
});

app.get('/postari', async (req, res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const postariPePagina = 5;
    const utilizatorId = req.session.id_utilizator || 0;
    const categorieId = req.query.id_categorie || null;
    const cautare = req.query.cautare ? req.query.cautare.trim() : '';

    let conditii = {};
    
    if (categorieId && categorieId != 0) {
        conditii.id_categorie = categorieId;
    }

    if (cautare) {
        conditii.continut = { [Sequelize.Op.like]: `%${cautare}%` };
    }

    try {
        const postari = await Postare.findAll({
            where: conditii,
            limit: postariPePagina,
            offset: (pagina - 1) * postariPePagina,
            order: [['id_postare', 'DESC']],
            include: [
                {
                    model: Utilizator,
                    as: 'utilizator',
                    attributes: ['nume_utilizator', 'imagine_profil']
                },
                {
                    model: Comentariu,
                    as: 'comentarii',
                    attributes: [
                        'id_comentariu',
                        'continut',
                        'data_postarii',
                        'id_utilizator',
                        [Sequelize.literal(`(SELECT COUNT(*) FROM Aprecieri WHERE Aprecieri.id_comentariu = comentarii.id_comentariu)`), 'numarAprecieri'],
                        [Sequelize.literal(`(SELECT SUM(CASE WHEN id_utilizator = ${utilizatorId} THEN 1 ELSE 0 END) FROM Aprecieri WHERE Aprecieri.id_comentariu = comentarii.id_comentariu AND Aprecieri.id_utilizator = ${utilizatorId})`), 'esteApreciat']
                    ],
                    include: {
                        model: Utilizator,
                        as: 'utilizator',
                        attributes: ['nume_utilizator', 'imagine_profil']
                    }
                }
            ],
            attributes: [
                'id_postare',
                'continut',
                'data_creare',
                'id_utilizator',
                [Sequelize.literal(`(SELECT COUNT(*) FROM Aprecieri WHERE Aprecieri.id_postare = Postare.id_postare)`), 'numarAprecieri'],
                [Sequelize.literal(`(SELECT SUM(CASE WHEN id_utilizator = ${utilizatorId} THEN 1 ELSE 0 END) FROM Aprecieri WHERE Aprecieri.id_postare = Postare.id_postare AND Aprecieri.id_utilizator = ${utilizatorId})`), 'esteApreciat']
            ]
        });

        const totalPostari = await Postare.count({ where: conditii });

        res.json({ postari, totalPostari });
    } catch (err) {
        console.error('Eroare la obținerea postărilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.delete('/postari', async (req, res) => {
    const { id_postare } = req.body;

    try {
        await Postare.destroy({ where: { id_postare } });

        res.json({ message: 'Postare ștearsă cu succes' });
    } catch (err) {
        console.error('Eroare la ștergerea postării:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.get('/categorii', async (req, res) => {
    try {
        const categorii = await Categorie.findAll({
            attributes: ['id_categorie', 'nume_categorie'],
            
        });
        res.json(categorii);
    } catch (err) {
        console.error('Eroare la obținerea categoriilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.post('/postari', async (req, res) => {
    const { continut, id_categorie } = req.body;
    const id_utilizator = req.session.id_utilizator;

    try {
        if (!continut || !id_categorie || !id_utilizator) {
            return res.status(400).json({ message: 'Lipsesc parametrii necesari' });
        }

        const postareNoua = await Postare.create({
            continut,
            id_categorie,
            id_utilizator
        });

        res.status(201).json({ message: 'Postare adăugată cu succes', postare: postareNoua });
    } catch (err) {
        console.error('Eroare la adăugarea postării:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});    

app.post('/aprecieri', async (req, res) => {
    const { id_utilizator, id_postare, id_comentariu } = req.body;

    try {
        if (!id_utilizator || (!id_postare && !id_comentariu)) {
            return res.status(400).json({ message: "Lipsesc parametrii necesari" });
        }

        const conditie = id_postare ? { id_utilizator, id_postare } : { id_utilizator, id_comentariu };

        const apreciereExistenta = await Apreciere.findOne({ where: conditie });

        if (apreciereExistenta) {
            await apreciereExistenta.destroy();
            return res.json({ mesaj: "Apreciere eliminată cu succes!", liked: false });
        } else {
            await Apreciere.create({ 
                id_utilizator, 
                id_postare: id_postare || null, 
                id_comentariu: id_comentariu || null, 
            });
            return res.json({ mesaj: "Apreciere adăugată cu succes!", liked: true });
        }
    } catch (err) {
        console.error("Eroare la gestionarea aprecierii:", err);
        res.status(500).json({ message: "Eroare la server" });
    }
});

app.post('/comentarii', async (req, res) => {
    const { continut, id_utilizator, id_postare } = req.body;

    try {
        if (!continut || !id_utilizator || !id_postare) {
            return res.status(400).json({ message: "Lipsesc parametrii necesari" });
        }

        const postare = await Postare.findByPk(id_postare);

        const comentariuNou = await Comentariu.create({
            continut,
            id_utilizator,
            id_postare
        });

        if (id_utilizator !== postare.id_utilizator) {
            await Notificare.create({
                id_utilizator: postare.id_utilizator,
                mesaj: `Ai primit un comentariu la postarea: "${postare.continut.split(' ').slice(0, 5).join(' ')}..."`
            });

            await Notificare.create({
                id_utilizator: id_utilizator,
                mesaj: `Ai trimis un comentariu la postarea: "${postare.continut.split(' ').slice(0, 5).join(' ')}..."`
            });
        }

        res.status(201).json({ message: "Comentariu adăugat cu succes", comentariu: comentariuNou });
    } catch (err) {
        console.error("Eroare la adăugarea comentariului:", err);
        res.status(500).json({ message: "Eroare la server" });
    }
});

app.delete('/comentarii', async (req, res) => {
    const { id_comentariu } = req.body;

    try {
        await Comentariu.destroy({ where: { id_comentariu } });

        res.json({ message: 'Comentariu șters cu succes' });
    } catch (err) {
        console.error('Eroare la ștergerea comentariului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});


app.get('/statistici', async (req, res) => {
    try {
        const numarPostari = await Postare.count();
        const numarComentarii = await Comentariu.count();
        const numarAprecieri = await Apreciere.count();
        const numarUtilizatori = await Utilizator.count();
        const postariPeCategorii = await Postare.findAll({
          attributes: [
            'id_categorie',
            [Sequelize.fn('COUNT', Sequelize.col('Postare.id_postare')), 'numar_postari']
          ],
          include: [
            {
              model: Categorie,
              as: 'categorie',
              attributes: ['nume_categorie']
            }
          ],
          group: ['id_categorie', 'categorie.id_categorie', 'categorie.nume_categorie'],
          order: [[Sequelize.literal('numar_postari'), 'DESC']]
        });

        const topUtilizatoriAprecieri = await Utilizator.findAll({
            attributes: [
                'id_utilizator',
                'nume_utilizator',
                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM (
                        SELECT a.id_apreciere 
                        FROM postari p 
                        JOIN aprecieri a ON p.id_postare = a.id_postare 
                        WHERE p.id_utilizator = Utilizator.id_utilizator
                        
                        UNION ALL
                        
                        SELECT a.id_apreciere 
                        FROM comentarii c 
                        JOIN aprecieri a ON c.id_comentariu = a.id_comentariu 
                        WHERE c.id_utilizator = Utilizator.id_utilizator
                    ) AS combined_aprecieri
                )`), 'total_aprecieri']
            ],
            order: [[sequelize.literal('total_aprecieri'), 'DESC']],
            limit: 10
        });

        const topUtilizatoriPostari = await Utilizator.findAll({
            attributes: [
                'id_utilizator',
                'nume_utilizator',
                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM postari p 
                    WHERE p.id_utilizator = Utilizator.id_utilizator
                )`), 'total_postari']
            ],
            order: [[sequelize.literal('total_postari'), 'DESC']],
            limit: 10
        });

        const topPostariAprecieri = await Postare.findAll({
            attributes: [
                'id_postare',
                'continut',
                'data_creare',
                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM aprecieri a 
                    WHERE a.id_postare = Postare.id_postare
                )`), 'numar_aprecieri'],
                [sequelize.literal(`(
                    SELECT nume_utilizator 
                    FROM utilizatori u 
                    WHERE u.id_utilizator = Postare.id_utilizator
                )`), 'autor_nume']
            ],
            include: [
                {
                    model: Categorie,
                    as: 'categorie',
                    attributes: ['nume_categorie']
                }
            ],
            order: [[sequelize.literal('numar_aprecieri'), 'DESC']],
            limit: 10
        });

        const topPostariComentarii = await Postare.findAll({
            attributes: [
                'id_postare',
                'continut',
                'data_creare',
                [sequelize.literal(`(
                    SELECT COUNT(*) 
                    FROM comentarii c 
                    WHERE c.id_postare = Postare.id_postare
                )`), 'numar_comentarii'],
                [sequelize.literal(`(
                    SELECT nume_utilizator 
                    FROM utilizatori u 
                    WHERE u.id_utilizator = Postare.id_utilizator
                )`), 'autor_nume']
            ],
            include: [
                {
                    model: Categorie,
                    as: 'categorie',
                    attributes: ['nume_categorie']
                }
            ],
            order: [[sequelize.literal('numar_comentarii'), 'DESC']],
            limit: 10
        });
    
        res.json({numarPostari, numarComentarii, numarAprecieri, numarUtilizatori, postariPeCategorii, topUtilizatoriAprecieri, topUtilizatoriPostari, topPostariAprecieri, topPostariComentarii});
      } catch (err) {
        console.error("Eroare la /statistici:", err);
        res.status(500).json({ error: "A apărut o eroare la generarea statisticilor." });
    }
});

app.get('/stiri', async (req, res) => {
    try {
        const stiri = await Stire.findAll({
            order: [['data_creare', 'DESC']],
            include: {
                model: Utilizator,
                as: 'utilizator',
                attributes: ['id_utilizator', 'nume_utilizator', 'imagine_profil']
            }
        });
        res.json(stiri);
    } catch (err) {
        console.error('Eroare la obținerea știrilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.log(`Serverul este pornit pe http://localhost:${port}`);
    } catch (err) {
        console.error('Eroare la sincronizarea bazei de date:', err);
    }
});
