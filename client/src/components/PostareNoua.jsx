import React, { useState, useEffect } from "react";
import "./styles/PostareNoua.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PostareNoua = () => {
    const [continut, setContinut] = useState("");
    const [categorii, setCategorii] = useState([]);
    const [categorieSelectata, setCategorieSelectata] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        afisareCategorii();
    }, [user, navigate]);

    const afisareCategorii = async () => {
        try {
            const raspuns = await fetch(`${API_URL}/categorii`, {
                credentials: "include"
            });
            const date = await raspuns.json();
            setCategorii(date);
        } catch (err) {
            console.error("Eroare la obținerea categoriilor:", err);
        }
    };

    const trimitePostare = async (e) => {
        e.preventDefault();
        try {
            const raspuns = await fetch(`${API_URL}/postari`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    continut,
                    id_categorie: categorieSelectata,
                }),
                credentials: "include",
            });

            if (raspuns.ok) {
                navigate("/");
            } else {
                console.error("Eroare la adăugarea postării:", raspuns.statusText);
            }
        } catch (err) {
            console.error("Eroare la adăugarea postării:", err);
        }
    };

    return (
        <div>
            <h2 className="titlu">Postare nouă</h2>
            <div className="postare-noua">
                <form id="postare-form" onSubmit={trimitePostare}>
                    <textarea
                        placeholder="Conținut"
                        value={continut}
                        onChange={(e) => setContinut(e.target.value)}
                        required
                        rows="5" 
                    />
                    <select
                        value={categorieSelectata}
                        onChange={(e) => setCategorieSelectata(e.target.value)}
                        required
                    >
                        <option value="">Selectează o categorie</option>
                        {categorii.map((categorie) => (
                            <option key={categorie.id_categorie} value={categorie.id_categorie}>
                                {categorie.nume_categorie}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Trimite</button>
                </form>
            </div>
        </div>
    );
};

export default PostareNoua;