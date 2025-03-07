import React, { useState, useEffect, useCallback } from "react";
import './styles/Home.css';
import { useAuth } from "./AuthContext";

const Home = () => {
    const [postari, setPostari] = useState([]);
    const [totalPostari, setTotalPostari] = useState(0);
    const [paginaCurenta, setPaginaCurenta] = useState(1);
    const { user } = useAuth();
    const totalPagini = Math.ceil(totalPostari / 5);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchPostari = useCallback(async () => {
        try {
            const raspuns = await fetch(`${API_URL}/postari?pagina=${paginaCurenta}`, {
                credentials: "include"
            });
            const date = await raspuns.json();

            setPostari(date.postari);
            setTotalPostari(date.totalPostari);
        } catch (err) {
            console.error("Eroare la obținerea postărilor:", err);
        }
    }, [paginaCurenta]);

    useEffect(() => {
        fetchPostari();
    }, [fetchPostari, user]);

    const handleLike = async (id_postare) => {
        if (!user) {
            alert("Trebuie să fii autentificat pentru a aprecia o postare.");
            return;
        }

        try {
            await fetch(`${API_URL}/aprecieri`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_utilizator: user.id_utilizator, id_postare }),
            });

            fetchPostari();
        } catch (err) {
            console.error("Eroare la aprecierea postării:", err);
        }
    };

    return (
        <div className="home-container">
            <h1>Postări</h1>
            <div className="postari-feed">
                {postari.map(postare => (
                    <div className="postare" key={postare.id_postare}>
                        <div className="postare-header">
                            <h2>{postare.continut}</h2>
                            <p className="data-creare">Creată la: {new Date(postare.data_creare).toLocaleString()}</p>
                        </div>
                        <div className="postare-actions">
                            <button 
                                className={`like-btn ${postare.userHasLiked ? "liked" : ""}`} 
                                onClick={() => handleLike(postare.id_postare)}
                            >
                                {postare.userHasLiked ? "Apreciat" : "Îmi place"}
                            </button>
                            <button>Comentarii</button>
                        </div>
                        <div className="postare-stats">
                            <p><strong>Aprecieri:</strong> {postare.numarAprecieri}</p>
                            <p><strong>Comentarii:</strong> 0 </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
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
