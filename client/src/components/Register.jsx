import React, { useState, useEffect } from "react";
import "./styles/Register.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Register = () => {
    const [numeUtilizator, setNumeUtilizator] = useState("");
    const [email, setEmail] = useState("");
    const [parola, setParola] = useState("");
    const [dataNastere, setDataNastere] = useState("");
    const { user, register } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); 
        }
    }, [user, navigate]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const rezultat = await register(numeUtilizator, email, parola, dataNastere);
        if (rezultat.success) {
            navigate("/");
            window.location.reload();
        } else {
            alert(rezultat.message || "Înregistrare eșuată");
        }
    };

    return (
        <div>
            <h2 className="titlu">Înregistrare</h2>
            <div className="register">
                <form id="register-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="nume utilizator" 
                        value={numeUtilizator}
                        onChange={(e) => setNumeUtilizator(e.target.value)}
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="parolă" 
                        value={parola}
                        onChange={(e) => setParola(e.target.value)}
                        required 
                    />
                    <input 
                        type="date" 
                        value={dataNastere}
                        onChange={(e) => setDataNastere(e.target.value)}
                        required
                    />
                    <button type="submit">Sign Up</button>
                    <span>Ai deja cont? <a href="/login">Login</a></span>
                </form>        
            </div>
        </div>
    );
};

export default Register;