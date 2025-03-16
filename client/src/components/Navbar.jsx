import React, { useState, useRef } from "react";
import "./styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import imagineProfilDefault from "./images/profile_photo.jpg";
import coffeeCup from '../../public/coffee-cup.svg'
import { useAuth } from "./AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [afiseazaMeniu, setAfiseazaMeniu] = useState(false);
    const meniuRef = useRef(null);
    const navigate = useNavigate();

    const toggleMeniu = () => setAfiseazaMeniu(!afiseazaMeniu);

    const navigheazaProfil = () => {
        navigate("/profil");
        setAfiseazaMeniu(false);
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
                            <strong>{user.nume_utilizator}</strong>
                            <img
                                src={user.imagine_profil || imagineProfilDefault} 
                                alt="Profil"
                                className="profil-img"
                                onClick={toggleMeniu}
                            />
                            {afiseazaMeniu && (
                                <div className="meniu-dropdown" ref={meniuRef}>
                                    <strong onClick={navigheazaProfil}>Profilul meu</strong><br />
                                    <button onClick={logout}>Deconectare</button>
                                </div>
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
