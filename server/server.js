const express = require('express');
const sequelize = require('./db');
const Sequelize = require('sequelize');
const Utilizator = require('./models/utilizator'); 
const Postare = require('./models/postare');
const Categorie = require('./models/categorie');
const Apreciere = require('./models/apreciere');
const Comentariu = require('./models/comentariu');
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

app.post('/conectare', async (req, res) => {
    const { email, parola } = req.body;

    try {
        const utilizator = await Utilizator.findOne({ where: { email: email } });

        if (!utilizator || utilizator.parola !== parola) { 
            return res.status(401).json({ message: 'Email sau parolă incorectă' });
        }

        req.session.utilizatorId = utilizator.id_utilizator;  
        req.session.nume_utilizator = utilizator.nume_utilizator;
        req.session.email = utilizator.email;
        req.session.este_moderator = utilizator.este_moderator;
        req.session.imagine_profil = utilizator.imagine_profil;

        res.json({
            id_utilizator: utilizator.id_utilizator,
            email: utilizator.email,
            data_inregistrare: utilizator.data_inregistrare,
            este_moderator: utilizator.este_moderator
        });

    } catch (err) {
        console.error('Eroare la autentificare:', err);
        res.status(500).json({ message: 'Eroare la server' });
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

app.get('/sesiune', (req, res) => {
    if (req.session.utilizatorId) {
        let imagineBase64 = null;
        if (req.session.imagine_profil && req.session.imagine_profil.data) {
            const buffer = Buffer.from(req.session.imagine_profil.data);
            imagineBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        }
        
        res.json({ 
                   id_utilizator: req.session.utilizatorId,
                   nume_utilizator: req.session.nume_utilizator, 
                   email: req.session.email, 
                   este_moderator: req.session.este_moderator,
                   imagine_profil: imagineBase64
                });
    } else {
        res.status(401).json({ message: 'Nu ești logat' });
    }
});

app.post('/inregistrare', async (req, res) => {
    const { nume_utilizator, email, parola, data_nastere } = req.body;

    try {
        const utilizatorExistent = await Utilizator.findOne({ where: { email } });
        if (utilizatorExistent) {
            return res.status(400).json({ message: 'Emailul este deja folosit!' });
        }

        const utilizatorNou = await Utilizator.create({
            nume_utilizator,
            email,
            parola, 
            data_nastere
        });

        req.session.utilizatorId = utilizatorNou.id_utilizator;  
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

app.get('/utilizatori', async (req, res) => {
    try {
        const utilizatori = await Utilizator.findAll({
            attributes: ['id_utilizator', 'nume_utilizator', 'email', 'este_moderator'],
            order: [['id_utilizator', 'ASC']],
            include: [
                {
                    model: Postare,
                    as: 'postari',
                    attributes: ['id_postare']
                },
                {
                    model: Comentariu,
                    as: 'comentarii',
                    attributes: ['id_comentariu']
                }
            ]
        })
        res.json(utilizatori);
    }
    catch (err) {
        console.error('Eroare la obținerea utilizatorilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
})

app.get('/profil', async (req, res) => {
    if (!req.session || !req.session.utilizatorId) {
        return res.status(401).json({ mesaj: 'Utilizator neautentificat' });
    }
    
    try {
        const utilizator = await Utilizator.findOne({
            where: { id_utilizator: req.session.utilizatorId },  
            attributes: ['nume_utilizator', 'email']
        });

        if (!utilizator) {
            return res.status(404).json({ mesaj: 'Utilizatorul nu a fost găsit' });
        }

        res.json(utilizator);
    } catch (error) {
        console.error('Eroare la obținerea profilului:', error);
        res.status(500).json({ mesaj: 'Eroare de server' });
    }
});

app.get('/postari', async (req, res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const postariPePagina = 5;
    const utilizatorId = req.session.utilizatorId || 0;

    try {
        const postari = await Postare.findAll({
            limit: postariPePagina,
            offset: (pagina - 1) * postariPePagina,
            order: [['id_postare', 'DESC']],
            include: [
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
                        attributes: ['nume_utilizator']
                    }
                },
                {
                    model: Apreciere,
                    as: 'aprecieri',
                    attributes: [],
                    required: false
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

        const totalPostari = await Postare.count();
        res.json({ postari, totalPostari });
    } catch (err) {
        console.error('Eroare la obținerea postărilor:', err);
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
    const id_utilizator = req.session.utilizatorId;

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
            return res.json({ message: "Apreciere eliminată", liked: false });
        } else {
            await Apreciere.create({ 
                id_utilizator, 
                id_postare: id_postare || null, 
                id_comentariu: id_comentariu || null, 
            });
            return res.json({ message: "Apreciere adăugată", liked: true });
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

        const comentariuNou = await Comentariu.create({
            continut,
            id_utilizator,
            id_postare
        });

        res.status(201).json({ message: "Comentariu adăugat cu succes", comentariu: comentariuNou });
    } catch (err) {
        console.error("Eroare la adăugarea comentariului:", err);
        res.status(500).json({ message: "Eroare la server" });
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
