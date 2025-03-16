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
    const [loadingProfil, setLoadingProfil] = useState(true);
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
                        setNumeUtilizator(date.nume_utilizator);
                        setEmail(date.email);
                        setImagineProfil(date.imagine_profil);
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

    if (loading || loadingProfil) {
        return <p>Se încarcă profilul...</p>;
    }

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
        </div>
    );
};

export default Profil;
