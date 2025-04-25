import React, { useState, useEffect } from "react";
import "./styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import imagineProfilAnonim from "./images/profil-anonim.jpg";
import imagineNotificari from "./images/notificari.png";
import imagineNotificariLipsa from "./images/notificari-lipsa.png";
import sanctiuni from "./images/sanctiuni.png";
import coffeeCup from '../../public/coffee-cup.svg';
import { useAuth } from "./AuthContext";

const Navbar = () => {
    const { user } = useAuth();
    const [imagineProfil, setImagineProfil] = useState(null);
    const [numeUtilizator, setNumeUtilizator] = useState("");
    const [notificari, setNotificari] = useState([]);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user) {
            const obtineDateProfil = async () => {
                try {
                    const raspuns = await fetch(`${API_URL}/profil/${user.id_utilizator}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (raspuns.ok) {
                        const date = await raspuns.json();
                        setImagineProfil(date.utilizator.imagine_profil);
                        setNumeUtilizator(date.utilizator.nume_utilizator);
                    } else {
                        console.error("Eroare la preluarea datelor profilului.");
                    }
                } catch (error) {
                    console.error("Eroare la conectarea cu serverul:", error);
                }
            };

            const obtineNotificari = async () => {
                try {
                    const raspuns = await fetch(`${API_URL}/notificari`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (raspuns.ok) {
                        const date = await raspuns.json();
                        setNotificari(date); 
                    } else {
                        console.error("Eroare la preluarea notificărilor.");
                    }
                } catch (error) {
                    console.error("Eroare la conectarea cu serverul pentru notificări:", error);
                }
            };

            obtineDateProfil();
            obtineNotificari();
        }
    }, [user]);

    const navigheazaProfil = () => {
        navigate(`/profil/${user.id_utilizator}`);
    };

    const navigheazaNotificari = () => {
        navigate("/notificari");
    };

    return (
        <nav>
            <div className="navbar">
                <div className="brand">
                    <img 
                        src={coffeeCup} 
                        alt="Coffee Cup" 
                        className="logo" 
                        onClick={() => navigate("/")}
                    />
                    <h1 onClick={() => navigate("/")}>Cafeneaua Economica</h1>
                </div>
                <div className="login-container">
                    {user ? (
                        <div className="profil-container">
                            <strong onClick={navigheazaProfil}>{numeUtilizator}</strong>
                            <img 
                                onClick={navigheazaProfil}
                                src={imagineProfil ? `${API_URL}/imagini/${imagineProfil}` : imagineProfilAnonim}
                                alt="Profil"
                                className="profil-img"
                            />
                            <img 
                                onClick={navigheazaNotificari}
                                src={notificari.length > 0 ? imagineNotificari : imagineNotificariLipsa} 
                                alt="Notificări" 
                                className="notificari-img"
                            />
                            {user && user.este_moderator && (
                                <img 
                                    onClick={() => navigate("/sanctiuni")} 
                                    src={sanctiuni} 
                                    alt="Sancțiuni" 
                                    className="sanctiuni-img"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="login-buttons">
                            <button onClick={() => navigate("/login")}>Login</button>
                            <button onClick={() => navigate('/register')}>Sign Up</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
