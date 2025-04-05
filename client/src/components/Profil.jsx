import React, { useState, useEffect } from "react";
import "./styles/Profil.css";
import { useNavigate } from "react-router-dom";
import imagineProfilAnonim from "./images/profil-anonim.jpg";
import { useAuth } from "./AuthContext";
import GlobalMessage from "./MesajGlobal";

const Profil = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [globalMessage, setGlobalMessage] = useState("");
    const [imagineProfil, setImagineProfil] = useState(null);
    const [numeUtilizator, setNumeUtilizator] = useState("");
    const [email, setEmail] = useState("");
    const [dataNastere, setDataNastere] = useState(""); 
    const [descriere, setDescriere] = useState("");
    const [varsta, setVarsta] = useState("");
    const [oras, setOras] = useState("");
    const [ocupatie, setOcupatie] = useState("");
    const [sanctiuni, setSanctiuni] = useState([]);
    const [editareProfil, setEditareProfil] = useState(false);
    const [imagineSelectata, setImagineSelectata] = useState(""); 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
            return;
        }

        if (user) {
            const obtineDateProfil = async () => {
                try {
                    const raspuns = await fetch(`${API_URL}/profil`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (raspuns.ok) {
                        const date = await raspuns.json();
                        console.log(date);
                        setImagineProfil(date.utilizator.imagine_profil);
                        setNumeUtilizator(date.utilizator.nume_utilizator);
                        setEmail(date.utilizator.email);
                        setDataNastere(date.utilizator.data_nastere);
                        setDescriere(date.utilizator.descriere);
                        setVarsta(date.utilizator.varsta);
                        setOras(date.utilizator.oras);
                        setOcupatie(date.utilizator.ocupatie);
                        setSanctiuni(date.sanctiuni);
                    } else {
                        console.error("Eroare la preluarea datelor profilului.");
                    }
                } catch (error) {
                    console.error("Eroare la conectarea cu serverul:", error);
                } 
            };

            obtineDateProfil();
        }
    }, [user, loading, navigate]);

    const editeazaProfil = async () => {
        try {
            let dateProfilModificate = {
                descriere,
                varsta,
                oras,
                ocupatie,
            };
    
            if (imagineSelectata && imagineSelectata !== imagineProfil) {
                dateProfilModificate.imagine_profil = imagineSelectata;
            }
    
            const raspuns = await fetch(`${API_URL}/profil`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(dateProfilModificate),
            });
    
            if (raspuns.ok) {
                setEditareProfil(false);
                setGlobalMessage("Profilul a fost actualizat cu succes.");
                
                if (imagineSelectata) {
                    setImagineProfil(imagineSelectata);
                }
            } else {
                setGlobalMessage("Eroare la actualizarea profilului. Încearcă din nou mai târziu.");
            }
        } catch (error) {
            console.error("Eroare la actualizarea profilului:", error);
        }
    };

    if (loading) {
        return <p>Se încarcă profilul...</p>;
    }

    return (
        <div>
            <GlobalMessage message={globalMessage} clearMessage={() => setGlobalMessage("")} />
            <h2 className="titlu">Profil utilizator</h2>
            <div className="profil">
                <img
                    src={imagineProfil ? `${API_URL}/imagini/${imagineProfil}` : imagineProfilAnonim}
                    alt="Imagine profil"
                    className="profil-imagine"
                />
                <p><strong>Nume:</strong> {numeUtilizator}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Data nașterii:</strong> {dataNastere}</p>
                {editareProfil ? (
                    <>
                        <label>Descriere:</label>
                        <textarea value={descriere} rows="5" onChange={(e) => setDescriere(e.target.value)} />
                        <label>Vârsta:</label>
                        <input type="number" value={varsta} onChange={(e) => setVarsta(e.target.value)} />
                        <label>Oraș:</label>
                        <input type="text" value={oras} onChange={(e) => setOras(e.target.value)} />
                        <label>Ocupație:</label>
                        <input type="text" value={ocupatie} onChange={(e) => setOcupatie(e.target.value)} />

                        <label>Imagine profil:</label>
                        <div className="imagine-selectata">
                            <div 
                                className={`imagine-option ${imagineSelectata === "avatar1.png" ? "selected" : ""}`}
                                onClick={() => setImagineSelectata("avatar1.png")}
                            >
                                <img src={`${API_URL}/imagini/avatar1.png`} alt="Avatar 1" />
                            </div>
                            <div 
                                className={`imagine-option ${imagineSelectata === "avatar2.png" ? "selected" : ""}`}
                                onClick={() => setImagineSelectata("avatar2.png")}
                            >
                                <img src={`${API_URL}/imagini/avatar2.png`} alt="Avatar 2" />
                            </div>
                            <div 
                                className={`imagine-option ${imagineSelectata === "avatar3.png" ? "selected" : ""}`}
                                onClick={() => setImagineSelectata("avatar3.png")}
                            >
                                <img src={`${API_URL}/imagini/avatar3.png`} alt="Avatar 3" />
                            </div>
                            <div 
                                className={`imagine-option ${imagineSelectata === "avatar4.png" ? "selected" : ""}`}
                                onClick={() => setImagineSelectata("avatar4.png")}
                            >
                                <img src={`${API_URL}/imagini/avatar4.png`} alt="Avatar 4" />
                            </div>
                            <div 
                                className={`imagine-option ${imagineSelectata === "avatar5.png" ? "selected" : ""}`}
                                onClick={() => setImagineSelectata("avatar5.png")}
                            >
                                <img src={`${API_URL}/imagini/avatar5.png`} alt="Avatar 5" />
                            </div>
                            <div 
                                className={`imagine-option ${imagineSelectata === "avatar6.png" ? "selected" : ""}`}
                                onClick={() => setImagineSelectata("avatar6.png")}
                            >
                                <img src={`${API_URL}/imagini/avatar6.png`} alt="Avatar 6" />
                            </div>
                        </div>
                        <button onClick={() => setEditareProfil(false)}>Anulează</button>
                        <button onClick={editeazaProfil}>Salvează</button>
                    </>
                ) : (
                    <>
                        <p><strong>Descriere:</strong> {descriere}</p>
                        <p><strong>Vârsta:</strong> {varsta}</p>
                        <p><strong>Oraș:</strong> {oras}</p>
                        <p><strong>Ocupație:</strong> {ocupatie}</p>
                        <p><strong>Sanctiuni:</strong></p>
                        <ul className="lista-sanctiuni">
                            {sanctiuni.length > 0 ? (
                                sanctiuni.map((sanctiune, index) => (
                                <li key={index}>
                                    <div className="continut-sanctiune">
                                        <strong>Sancțiune: </strong>
                                        <span>{sanctiune.sanctiune}</span><br />
                                        <strong>Durata sancțiunii: </strong>
                                        <span>{sanctiune.durata_sanctiune.slice(0, 10)}</span>
                                    </div>
                                </li>
                                ))
                            ) : (
                                <li>Nu există sancțiuni.</li>
                            )}
                        </ul>
                        <button onClick={() => setEditareProfil(true)}>Editează profilul</button>
                        <button onClick={logout}>Deconectare</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profil;