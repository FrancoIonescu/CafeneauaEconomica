import React, { useState, useEffect } from "react";
import "./styles/Sanctiuni.css";
import { useNavigate } from "react-router-dom";
import imagineProfilAnonim from "./images/profil-anonim.jpg";
import { useAuth } from "./AuthContext";
import MesajGlobal from "./MesajGlobal";

const Sanctiuni = () => {
    const { user, loading } = useAuth();
    const [utilizatori, setUtilizatori] = useState([]);
    const [continutDeSters, setContinutDeSters] = useState(null);
    const [utilizatorDeSters, setUtilizatorDeSters] = useState(null);
    const [mesajGlobal, setMesajGlobal] = useState("");
    const [utilizatorSanctiune, setUtilizatorSanctiune] = useState(null);
    const [formularSanctiune, setFormularSanctiune] = useState(false);
    const [sanctiuneNoua, setSanctiuneNoua] = useState("");
    const [durataSanctiuneNoua, setDurataSanctiuneNoua] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
            return;
        }

        const obtineUtilizatoriCuSanctiuni = async () => {
            try {
                const raspuns = await fetch(`${API_URL}/utilizatori`);
                if (!raspuns.ok) throw new Error("Eroare la preluarea utilizatorilor și sancțiunilor");
                const data = await raspuns.json();
                setUtilizatori(data);
            } catch (error) {
                console.error("Eroare:", error);
            }
        };
        obtineUtilizatoriCuSanctiuni();
    }, [user, utilizatori, loading, navigate]);

    const afisareFormularSanctiune = (utilizator) => {
        setUtilizatorSanctiune(utilizator);
        setFormularSanctiune(true);
        setSanctiuneNoua("");
        setDurataSanctiuneNoua("");
    };

    const trimiteSanctiune = async () => {
        if (!sanctiuneNoua || !durataSanctiuneNoua || !utilizatorSanctiune?.id_utilizator) {
            setMesajGlobal("Te rugăm să completezi toate câmpurile pentru sancțiune.");
            return;
        }

        try {
            const raspuns = await fetch(`${API_URL}/sanctiuni`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_utilizator: utilizatorSanctiune.id_utilizator,
                    sanctiune: sanctiuneNoua,
                    durata_sanctiune: new Date(durataSanctiuneNoua).toISOString(), 
                }),
                credentials: "include",
            });

            if (raspuns.ok) {
                setMesajGlobal("Sancțiunea a fost adăugată cu succes.");
                setFormularSanctiune(false);
                setUtilizatorSanctiune(null);
            } else {
                const errorData = await raspuns.json();
                throw new Error(errorData?.message || "Eroare la adăugarea sancțiunii");
            }
        } catch (error) {
            console.error("Eroare:", error);
            setMesajGlobal(`Eroare la adăugarea sancțiunii: ${error.message}`);
        }
    };

    const stergeSanctiune = async (id_sanctiune) => {
        try {
            const raspuns = await fetch(`${API_URL}/sanctiuni`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_sanctiune }),
                credentials: "include",
            });

            if (raspuns.ok) {
                setContinutDeSters(null);
                setMesajGlobal("Sancțiunea a fost ștearsă cu succes.");
            } else {
                throw new Error("Eroare la ștergerea sancțiunii");
            }
        } catch (error) {
            console.error("Eroare:", error);
            setMesajGlobal("Eroare la ștergerea sancțiunii.");
        }
    };

    const stergeUtilizator = async (id_utilizator) => {
        try {
            const raspuns = await fetch(`${API_URL}/utilizatori`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_utilizator }),
                credentials: "include",
            });

            if (raspuns.ok) {
                setUtilizatorDeSters(null);
                setMesajGlobal("Utilizatorul a fost șters cu succes.");
            } else {
                throw new Error("Eroare la ștergerea utilizatorului");
            }
        } catch (error) {
            console.error("Eroare:", error);
            setMesajGlobal("Eroare la ștergerea utilizatorului.");
        }
    }

    return (
        <div>
            <MesajGlobal mesaj={mesajGlobal} stergeMesaj={() => setMesajGlobal("")} />
            <h2 className="titlu">Sanctiuni</h2>
            <div className="sanctiuni">
                <ul>
                    {utilizatori.map((utilizator) => (
                        <li key={utilizator.id_utilizator} className="utilizator">
                            <div className="informatii-utilizator">
                                <img
                                    src={utilizator.imagine_profil ? `${API_URL}/imagini/${utilizator.imagine_profil}` : imagineProfilAnonim}
                                    alt={utilizator.nume_utilizator}
                                    className="imagine-profil"
                                />
                                <div className="detalii-utilizator">
                                    <strong>{utilizator.nume_utilizator}</strong>
                                    <button onClick={() => afisareFormularSanctiune(utilizator)}>Adaugă</button>
                                </div>
                            </div>
                            {utilizatorSanctiune?.id_utilizator === utilizator.id_utilizator && formularSanctiune && (
                                <div className="formular-sanctiune">
                                    <label htmlFor="sanctiune">Sancțiune:</label>
                                    <input
                                        type="text"
                                        id="sanctiune"
                                        value={sanctiuneNoua}
                                        onChange={(e) => setSanctiuneNoua(e.target.value)}
                                    />
                                    <label htmlFor="durata">Durată (Data):</label>
                                    <input
                                        type="date"
                                        id="durata"
                                        value={durataSanctiuneNoua}
                                        onChange={(e) => setDurataSanctiuneNoua(e.target.value)}
                                    />
                                    <div className="formular-sanctiune-butoane">
                                        <button onClick={() => setFormularSanctiune(false)}>Anulează</button>
                                        <button onClick={trimiteSanctiune}>Trimite</button>
                                    </div>
                                </div>
                            )}
                            {utilizator.sanctiuni && utilizator.sanctiuni.length > 0 && (
                                <div className="sanctiuni-utilizator">
                                    <h3>Sancțiuni:</h3>
                                    <ul>
                                    {utilizator.sanctiuni.map((sanctiune) => (
                                        <li key={sanctiune.id_sanctiune}>
                                            <div className="continut-sanctiune">
                                                <p><strong>Sancțiune:</strong> <span>{sanctiune.sanctiune}</span></p>
                                                <p><strong>Durată:</strong> <span>{new Date(sanctiune.durata_sanctiune).toLocaleDateString()}</span></p>
                                            </div>
                                            <button onClick={() => setContinutDeSters(sanctiune.id_sanctiune)}>Șterge</button>
                                            {continutDeSters === sanctiune.id_sanctiune && (
                                                <div className="modal">
                                                    <p>Ești sigur că vrei să ștergi această sancțiune?</p>
                                                    <button onClick={() => setContinutDeSters(null)}>Nu</button>
                                                    <button onClick={() => stergeSanctiune(sanctiune.id_sanctiune)}>Da</button>
                                                </div>
                                            )}
                                        </li>
                                    ))}

                                    </ul>
                                </div>
                            )}
                            {utilizator.sanctiuni && utilizator.sanctiuni.length === 0 && (
                                <p className="fara-sanctiuni">Nu are sancțiuni.</p>
                            )}
                            {utilizator.sanctiuni.length >= 3 && (
                                <button id="buton-stergere-utilizator" onClick={() => setUtilizatorDeSters(utilizator.id_utilizator)}>Șterge utilizator</button>
                            )} 
                            {utilizatorDeSters === utilizator.id_utilizator && (
                                <div className="modal">
                                    <p>Ești sigur că vrei să ștergi acest utilizator?</p>
                                    <button onClick={() => setUtilizatorDeSters(null)}>Nu</button>
                                    <button onClick={() => stergeUtilizator(utilizator.id_utilizator)}>Da</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sanctiuni;