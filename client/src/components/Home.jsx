import React, { useState, useEffect, useCallback } from "react";
import './styles/Home.css';
import { useNavigate } from "react-router-dom";
import imagineProfilAnonim from "./images/profil-anonim.jpg";
import { useAuth } from "./AuthContext";
import MesajGlobal from "./MesajGlobal";

const Home = () => {
    const [postari, setPostari] = useState([]);
    const [stiri, setStiri] = useState([]);
    const [totalPostari, setTotalPostari] = useState(0);
    const [paginaCurenta, setPaginaCurenta] = useState(1);
    const [categorii, setCategorii] = useState([]);
    const [categorieSelectata, setCategorieSelectata] = useState(0);
    const [inputCautare, setInputCautare] = useState("");
    const [cautare, setCautare] = useState("");
    const [comentariiVizibile, setComentariiVizibile] = useState(null);
    const [comentariuNou, setComentariuNou] = useState("");
    const [continutDeSters, setContinutDeSters] = useState("");
    const [mesajGlobal, setMesajGlobal] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const totalPagini = Math.ceil(totalPostari / 5) || 1; 
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

    const afisareStiri = async () => {
        try {
          const raspuns = await fetch(`${API_URL}/stiri`, {
            method: "GET",
            credentials: "include",
          });
    
          if (raspuns.ok) {
            const date = await raspuns.json();
            setStiri(date);
          } else {
            console.error("Eroare la preluarea știrilor.");
          }
        } catch (error) {
          console.error("Eroare la conectarea cu serverul:", error);
        }
    };

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
        afisareStiri();
    }, [afisarePostari, user]);

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
            setMesajGlobal(data.mesaj);
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
                setMesajGlobal("Comentariul a fost adăugat cu succes!");
                setComentariuNou("");
                afisarePostari();
            } else {
                throw new Error("Eroare la trimiterea comentariului");
            }
        } catch (err) {
            console.error("Eroare la trimiterea comentariului:", err);
        }
    };

    const afisareComentarii = (id_postare) => {
        setComentariiVizibile(prev => (prev === id_postare ? null : id_postare));
    };

    const stergePostare = async (id_postare) => {
        try {
            const raspuns = await fetch(`${API_URL}/postari`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_postare }),
                credentials: "include",
            });

            if (raspuns.ok) {
                setContinutDeSters(null);
                setMesajGlobal("Postarea a fost ștearsă cu succes!");
                afisarePostari();
            } else {
                throw new Error("Eroare la ștergerea postării");
            }
        } catch (err) {
            console.error("Eroare la ștergerea postării:", err);
        }
    }

    const stergeComentariu = async (id_comentariu) => {
        try {
            const raspuns = await fetch(`${API_URL}/comentarii`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_comentariu }),
                credentials: "include",
            });

            if (raspuns.ok) {
                setContinutDeSters(null);
                setMesajGlobal("Comentariul a fost șters cu succes!");
                afisarePostari();
            } else {
                throw new Error("Eroare la ștergerea comentariului");
            }
        } catch (err) {
            console.error("Eroare la ștergere comentariu:", err);
        }
    };

    return (
        <div className="home">
            <MesajGlobal mesaj={mesajGlobal} stergeMesaj={() => setMesajGlobal("")} />
            <h1>Postări</h1>
            <div className="categorii-feed">
                <h2>Categorii</h2>
                {categorii.map(categorie => (
                    <div 
                        key={categorie.id_categorie} 
                        className='categorie'
                        onClick={() => selecteazaCategorie(categorie.id_categorie)}>
                        {categorie.nume_categorie}
                    </div>
                ))}
            </div>
            <div className="postari-feed">
                <div className="postari-header">
                    <button onClick={() => navigate("/postare")}>
                        Postare nouă
                    </button>
                    <input 
                        type="text" 
                        value={inputCautare} 
                        onChange={(e) => setInputCautare(e.target.value)} 
                        placeholder="Caută postări..."
                    />
                    <button onClick={() => setCautare(inputCautare)}>Caută</button>
                </div>
                {postari.length === 0 ? (
                    <div className="fara-postari">
                        <p>Nu există postări disponibile.</p>
                    </div>
                ) : (
                    postari.map(postare => (
                        <div className="postare" key={postare.id_postare}>
                            <div className="postare-header">
                                <div className="continut-autor">
                                    <img
                                        src={postare.utilizator.imagine_profil ? `${API_URL}/imagini/${postare.utilizator.imagine_profil}` : imagineProfilAnonim}
                                        alt="Profil"
                                        className="profil-img"
                                    />
                                    <strong>{postare.utilizator.nume_utilizator}</strong>
                                    {user && (postare.id_utilizator === user.id_utilizator || user.este_moderator) && (
                                        <button className="delete-btn" onClick={() => setContinutDeSters(postare.id_postare)}>
                                            Șterge
                                        </button>
                                    )}
                                    {continutDeSters === postare.id_postare && (
                                        <div className="modal">
                                            <p>Ești sigur că vrei să ștergi această postare?</p>
                                            <button onClick={() => setContinutDeSters(null)}>Nu</button>
                                            <button onClick={() => stergePostare(postare.id_postare)}>Da</button>
                                        </div>
                                    )}
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
                                                            src={comentariu.utilizator.imagine_profil ? `${API_URL}/imagini/${comentariu.utilizator.imagine_profil}` : imagineProfilAnonim}
                                                            alt="Profil"
                                                            className="profil-img"
                                                        />
                                                        <strong>
                                                            {comentariu.utilizator.nume_utilizator}
                                                        </strong>
                                                        {user && (comentariu.id_utilizator === user.id_utilizator || user.este_moderator) && (
                                                            <button className="delete-btn" onClick={() => setContinutDeSters(comentariu.id_comentariu)}>
                                                                Șterge
                                                            </button>
                                                        )}
                                                        {continutDeSters === comentariu.id_comentariu && (
                                                            <div className="modal">
                                                                <p>Ești sigur că vrei să ștergi acest comentariu?</p>
                                                                <div className="modal-butoane">
                                                                    <button onClick={() => setContinutDeSters(null)}>Nu</button>
                                                                    <button onClick={() => stergeComentariu(comentariu.id_comentariu)}>Da</button>
                                                                </div>
                                                            </div>
                                                        )}
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
                    ))
                )}
            </div>
            <div className="stiri-feed">
                <h2>Buletin Informativ</h2>
                <ul>
                    {stiri.slice(0, 3).map(stire => (
                    <li
                        key={stire.id_stire}
                        onClick={() => navigate("/stiri")}
                    >
                        <strong>{stire.titlu}</strong>
                        <p>{stire.continut.slice(0, 102)}...</p>
                    </li>
                    ))}
                    <a href="/stiri">Du-te la știri</a>
                </ul>
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