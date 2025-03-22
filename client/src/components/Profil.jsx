import React, { useState, useEffect } from "react";
import "./styles/Profil.css";
import { useNavigate } from "react-router-dom";
import imagineProfilDefault from "./images/profile_photo.jpg";
import { useAuth } from "./AuthContext";

const Profil = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [imagineProfil, setImagineProfil] = useState(null);
    const [numeUtilizator, setNumeUtilizator] = useState("");
    const [email, setEmail] = useState("");
    const [dataNastere, setDataNastere] = useState(""); 
    const [descriere, setDescriere] = useState("");
    const [varsta, setVarsta] = useState("");
    const [oras, setOras] = useState("");
    const [ocupatie, setOcupatie] = useState("");
    const [loadingProfil, setLoadingProfil] = useState(true);
    const [editMode, setEditMode] = useState(false);
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
                        setImagineProfil(date.imagine_profil);
                        setNumeUtilizator(date.nume_utilizator);
                        setEmail(date.email);
                        setDataNastere(date.data_nastere);
                        setDescriere(date.descriere);
                        setVarsta(date.varsta);
                        setOras(date.oras);
                        setOcupatie(date.ocupatie);
                    } else {
                        console.error("Eroare la preluarea datelor profilului.");
                    }
                } catch (error) {
                    console.error("Eroare la conectarea cu serverul:", error);
                } finally {
                    setLoadingProfil(false);
                }
            };

            obtineDateProfil();
        }
    }, [user, loading, navigate]);

    const convertToBase64 = (arrayBuffer) => {
        if (!arrayBuffer) return null;
        const uint8Array = new Uint8Array(arrayBuffer);
        const stringChar = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
        return `data:image/jpeg;base64,${btoa(stringChar)}`;
    };

    const handleUpdateProfil = async () => {
        try {
            const raspuns = await fetch(`${API_URL}/profil`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ descriere, varsta, oras, ocupatie }),
            });

            if (raspuns.ok) {
                alert("Profil actualizat cu succes!");
                setEditMode(false);
            } else {
                alert("Eroare la actualizarea profilului.");
            }
        } catch (error) {
            console.error("Eroare la actualizarea profilului:", error);
        }
    };

    if (loading || loadingProfil) {
        return <p>Se încarcă profilul...</p>;
    }

    console.log(varsta)
    return (
        <div className="profil">
            <h2>Profil utilizator</h2>
            <img
                src={imagineProfil ? convertToBase64(imagineProfil.data) : imagineProfilDefault}
                alt="Imagine profil"
                className="profil-imagine"
            />
            <p><strong>Nume:</strong> {numeUtilizator}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Data nașterii:</strong> {dataNastere}</p>
            {editMode ? (
                <>
                    <label>Descriere:</label>
                    <textarea value={descriere} rows="5" onChange={(e) => setDescriere(e.target.value)} />
                    <label>Vârsta:</label>
                    <input type="number" value={varsta} onChange={(e) => setVarsta(e.target.value)} />
                    <label>Oraș:</label>
                    <input type="text" value={oras} onChange={(e) => setOras(e.target.value)} />
                    <label>Ocupație:</label>
                    <input type="text" value={ocupatie} onChange={(e) => setOcupatie(e.target.value)} />
                    <button onClick={() => setEditMode(false)}>Anulează</button>
                    <button onClick={handleUpdateProfil}>Salvează</button>
                </>
            ) : (
                <>
                    <p><strong>Descriere:</strong> {descriere}</p>
                    <p><strong>Vârsta:</strong> {varsta}</p>
                    <p><strong>Oraș:</strong> {oras}</p>
                    <p><strong>Ocupație:</strong> {ocupatie}</p>
                    <button onClick={() => setEditMode(true)}>Editează profilul</button>
                </>
            )}
        </div>
    );
};

export default Profil;