import React, { useState, useEffect, useCallback } from "react";
import './styles/Home.css';
import { useNavigate } from "react-router-dom";
import imagineProfilDefault from "./images/profile_photo.jpg";
import { useAuth } from "./AuthContext";

const Home = () => {
    const [postari, setPostari] = useState([]);
    const [totalPostari, setTotalPostari] = useState(0);
    const [paginaCurenta, setPaginaCurenta] = useState(1);
    const [categorii, setCategorii] = useState([]);
    const [categorieSelectata, setCategorieSelectata] = useState(0);
    const [inputCautare, setInputCautare] = useState("");
    const [cautare, setCautare] = useState("");
    const [comentariiVizibile, setComentariiVizibile] = useState(null);
    const [baraVizibila, setBaraVizibila] = useState(true);
    const [comentariuNou, setComentariuNou] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const totalPagini = Math.ceil(totalPostari / 5);
    const API_URL = import.meta.env.VITE_API_URL;

    const afisarePostari = useCallback(async () => {
        try {
            const raspuns = await fetch(`${API_URL}/postari?pagina=${paginaCurenta}&id_categorie=${categorieSelectata}&cautare=${encodeURIComponent(cautare)}`, {
                credentials: "include"
            });
            const date = await raspuns.json();

            setPostari(date.postari);
            setTotalPostari(date.totalPostari);
        } catch (err) {
            console.error("Eroare la obținerea postărilor:", err);
        }
    }, [paginaCurenta, categorieSelectata, cautare]);

    useEffect(() => {
        const afisareCategorii = async () => {
            try {
                const raspuns = await fetch(`${API_URL}/categorii`);
                const date = await raspuns.json();
                setCategorii([{ id_categorie: 0, nume_categorie: "Toate" }, ...date]);
            } catch (err) {
                console.error("Eroare la obținerea categoriilor:", err);
            }
        };
        afisareCategorii();
        afisarePostari();
    }, [afisarePostari, user]);

    const vizibilitateBaraCategorii = () => {
        setBaraVizibila(!baraVizibila);
    };

    const selecteazaCategorie = (id_categorie) => {
        setCategorieSelectata(id_categorie);
        setPaginaCurenta(1); 
    };

    const trimiteApreciere = async (id_postare, id_comentariu = null) => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const raspuns = await fetch(`${API_URL}/aprecieri`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id_utilizator: user.id_utilizator, 
                    id_postare: id_comentariu ? null : id_postare, 
                    id_comentariu: id_comentariu || null 
                }),
            });

            const data = await raspuns.json();

            afisarePostari();
        } catch (err) {
            console.error("Eroare la apreciere:", err);
        }
    };

    const trimiteComentariu = async (id_postare) => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!comentariuNou.trim()) {
            return;
        }
    
        try {
            const raspuns = await fetch(`${API_URL}/comentarii`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    continut: comentariuNou,
                    id_utilizator: user.id_utilizator, 
                    id_postare: id_postare,
                }),
            });
    
            if (raspuns.ok) {
                const comentariuAdaugat = await raspuns.json();
                console.log("Comentariu adăugat:", comentariuAdaugat);
    
                setComentariuNou("");
                afisarePostari();
            } else {
                console.error("Eroare la adăugarea comentariului:", raspuns.statusText);
            }
        } catch (err) {
            console.error("Eroare la trimiterea comentariului:", err);
        }
    };

    const afisareComentarii = (id_postare) => {
        setComentariiVizibile(prev => (prev === id_postare ? null : id_postare));
    };

    return (
        <div className="home">
            <h1>Postări</h1>
            <div className="bara-categorii">
                <button onClick={vizibilitateBaraCategorii}>
                    {baraVizibila ? 'Ascunde categorii' : 'Afișează Categorii'}
                </button>
            </div>
            {baraVizibila && (
                <div className="lista-categorii">
                    {categorii.map(categorie => (
                        <div 
                            key={categorie.id_categorie} 
                            className={`categorie ${categorie.id_categorie === categorieSelectata ? 'selectata' : ''}`}
                            onClick={() => selecteazaCategorie(categorie.id_categorie)}>
                            {categorie.nume_categorie}
                        </div>
                    ))}
                </div>
            )}
            <div className="postari-feed">
                <button onClick={() => navigate("/postare-noua")}>
                    Postare nouă
                </button>
                <input 
                    type="text" 
                    value={inputCautare} 
                    onChange={(e) => setInputCautare(e.target.value)} 
                    placeholder="Caută postări..."
                />
                <button onClick={() => setCautare(inputCautare)}>Caută</button>
                {postari.map(postare => (
                    <div className="postare" key={postare.id_postare}>
                        <div className="postare-header">  
                            <div className="continut-autor">
                                <img 
                                    src={postare.utilizator.imagine_profil ? `${API_URL}/imagini/${postare.utilizator.imagine_profil}` : imagineProfilDefault}
                                    alt="Profil" 
                                    className="profil-img"
                                />
                                <strong>{postare.utilizator.nume_utilizator}</strong>
                            </div>
                            <h2>{postare.continut}</h2>
                            <p>Creată la: {new Date(postare.data_creare).toLocaleString()}</p>  
                        </div>
                        <div className="postare-actions">
                            <button
                                className={`like-btn ${postare.esteApreciat ? "liked" : ""}`}
                                onClick={() => trimiteApreciere(postare.id_postare)}
                            >
                                {postare.esteApreciat ? "Apreciat" : "Îmi place"}
                            </button>
                            <button onClick={() => afisareComentarii(postare.id_postare)}>
                                {comentariiVizibile === postare.id_postare ? "Ascunde comentarii" : "Comentarii"}
                            </button>
                        </div>
                        <div className="postare-stats">
                            <p><strong>Aprecieri:</strong> {postare.numarAprecieri}</p>
                            <p><strong>Comentarii:</strong> {postare.comentarii ? postare.comentarii.length : 0}</p>
                        </div>
                        {comentariiVizibile === postare.id_postare && (
                            <div className="comentarii-container">
                                {postare.comentarii && postare.comentarii.length > 0 && (
                                    <div className="comentarii">
                                    {postare.comentarii.map(comentariu => (
                                        <div className="comentariu" key={comentariu.id_comentariu}>
                                            <div className="continut-autor">
                                                <img 
                                                    src={comentariu.utilizator.imagine_profil ? `${API_URL}/imagini/${comentariu.utilizator.imagine_profil}` : imagineProfilDefault}
                                                    alt="Profil" 
                                                    className="profil-img"
                                                />
                                                <strong>
                                                    {comentariu.utilizator.nume_utilizator}
                                                </strong>
                                            </div>
                                            <p className="continut-comentariu">{comentariu.continut}</p>
                                            <button
                                                className={`like-btn ${comentariu.esteApreciat ? "liked" : ""}`}
                                                onClick={() => trimiteApreciere(postare.id_postare, comentariu.id_comentariu)}
                                            >
                                                {comentariu.esteApreciat ? "Apreciat" : "Îmi place"}
                                            </button>
                                            <div className="comentariu-stats">
                                                <p><strong>Aprecieri:</strong> {comentariu.numarAprecieri}</p>
                                                <p className="comentariu-data">{new Date(comentariu.data_postarii).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                )}
                                <div className="adauga-comentariu">
                                    <input
                                        type="text"
                                        placeholder="Adaugă un comentariu..."
                                        value={comentariuNou}
                                        onChange={(e) => setComentariuNou(e.target.value)}
                                    />
                                    <button onClick={() => trimiteComentariu(postare.id_postare)}>Trimite</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="paginare">
                <button onClick={() => setPaginaCurenta(paginaCurenta - 1)} disabled={paginaCurenta === 1}>
                    Pagina anterioară
                </button>
                <button onClick={() => setPaginaCurenta(paginaCurenta + 1)} disabled={paginaCurenta === totalPagini}>
                    Pagina următoare
                </button>
            </div>
        </div>
    );
};

export default Home;