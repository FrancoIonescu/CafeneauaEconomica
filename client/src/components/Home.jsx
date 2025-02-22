import React, { useState, useEffect } from "react";
import './styles/Home.css';
import { useAuth } from "./AuthContext";

const Home = () => {
    const [postari, setPostari] = useState([]);
    const [totalPostari, setTotalPostari] = useState(0);
    const [paginaCurenta, setPaginaCurenta] = useState(1);
    const { user } = useAuth();
    const totalPagini = Math.ceil(totalPostari / 5);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchPostari = async () => {
            try {
                const raspuns = await fetch(`${API_URL}/postari?pagina=${paginaCurenta}`);
                const date = await raspuns.json();
                setPostari(date.postari);
                setTotalPostari(date.totalPostari);
            } catch (err) {
                console.error("Eroare la obținerea postărilor:", err);
            }
        };

        fetchPostari();
    }, [paginaCurenta]);

    const handleLike = (id_postare) => {
        // Poți actualiza logica pentru a trimite un "like" la backend
        console.log(`Postarea ${id_postare} a primit un like!`);
    };

    const handleComment = (id_postare) => {
        // Poți deschide o fereastră modală pentru comentarii
        console.log(`Comentarii pentru postarea ${id_postare}`);
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
                            <button className="like-btn" onClick={() => handleLike(postare.id_postare)}>
                                Îmi place
                            </button>
                            <button className="comment-btn" onClick={() => handleComment(postare.id_postare)}>
                                Commentarii
                            </button>
                        </div>
                        <div className="postare-stats">
                            <p><strong>Aprecieri:</strong> 0</p>  {/* Poți actualiza acest număr */}
                            <p><strong>Comentarii:</strong> 0</p>  {/* Poți actualiza acest număr */}
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
