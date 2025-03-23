import React, { useState } from "react";
import "./styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import imagineProfilDefault from "./images/profile_photo.jpg";
import notificationBell from "./images/notification-bell.png";
import coffeeCup from '../../public/coffee-cup.svg'
import { useAuth } from "./AuthContext";

const Navbar = () => {
    const { user } = useAuth();
    const [imagineProfil, setImagineProfil] = useState(null);
    const [numeUtilizator, setNumeUtilizator] = useState("");
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

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
                } else {
                    console.error("Eroare la preluarea datelor profilului.");
                }
            } catch (error) {
                console.error("Eroare la conectarea cu serverul:", error);
            }
        };

        obtineDateProfil();
    }

    const navigheazaProfil = () => {
        navigate("/profil");
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
                                src={imagineProfil ? `${API_URL}/imagini/${imagineProfil}` : imagineProfilDefault}
                                alt="Profil"
                                className="profil-img"
                            />
                            <img 
                                onClick={navigheazaNotificari}
                                src={notificationBell} 
                                alt="Notificari" 
                                className="notification-img" />
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
