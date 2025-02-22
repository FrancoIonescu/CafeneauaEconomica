import React, { useState, useEffect } from "react";
import "./styles/Profil.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Profil = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
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

    if (loading || loadingProfil) {
        return <p>Se încarcă profilul...</p>;
    }

    return (
        <div className="profil">
            <h2>Profil utilizator</h2>
            <p><strong>Nume:</strong> {numeUtilizator}</p>
            <p><strong>Email:</strong> {email}</p>
        </div>
    );
};

export default Profil;
