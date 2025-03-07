const express = require('express');
const sequelize = require('./db');
const Sequelize = require('sequelize');
const Utilizator = require('./models/utilizator'); 
const Postare = require('./models/postare');
const Apreciere = require('./models/apreciere');
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

app.get('/postari', async (req, res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const postariPePagina = 5;
    const utilizatorId = req.session.utilizatorId;

    try {
        const postari = await Postare.findAll({
            limit: postariPePagina,
            offset: (pagina - 1) * postariPePagina,
            include: [
                {
                    model: Apreciere,
                    attributes: [],
                    as: 'aprecieri'
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("aprecieri.id_apreciere")), "numarAprecieri"],
                    [Sequelize.literal(`(
                        SELECT GROUP_CONCAT(id_utilizator) 
                        FROM aprecieri 
                        WHERE aprecieri.id_postare = postare.id_postare
                    )`), "idUtilizatoriAprecieri"],
                    [Sequelize.literal(`(
                        SELECT COUNT(*) > 0 
                        FROM aprecieri 
                        WHERE aprecieri.id_postare = postare.id_postare 
                        AND aprecieri.id_utilizator = ${utilizatorId || 0}
                    )`), "userHasLiked"]
                ]
            },
            group: ["postare.id_postare"],
            order: [['id_postare', 'DESC']],
            subQuery: false
        });

        const totalPostari = await Postare.count();

        res.json({ postari, totalPostari });
    } catch (err) {
        console.error('Eroare la obținerea postărilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

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

app.post('/aprecieri', async (req, res) => {
    const { id_utilizator, id_postare } = req.body;

    try {
        if (!id_utilizator || !id_postare) {
            return res.status(400).json({ message: "Lipsesc parametrii necesari" });
        }

        const apreciereExistenta = await Apreciere.findOne({ where: { id_utilizator, id_postare } });

        if (apreciereExistenta) {
            await apreciereExistenta.destroy();
            return res.json({ message: "Apreciere eliminată", liked: false });
        } else {
            await Apreciere.create({ id_utilizator, id_postare, data_apreciere: new Date() });
            return res.json({ message: "Postare apreciată", liked: true });
        }
    } catch (err) {
        console.error("Eroare la gestionarea aprecierii:", err);
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
