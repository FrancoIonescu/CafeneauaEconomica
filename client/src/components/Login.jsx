import React, { useState, useEffect } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import GlobalMessage from "./GlobalMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [parola, setParola] = useState("");
    const [globalMessage, setGlobalMessage] = useState("");
    const { login, user } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); 
        }
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const rezultat = await login(email, parola);
        if (rezultat.success) {
            navigate("/");
            window.location.reload();
        } else {
            console.log(rezultat)
            setGlobalMessage(rezultat.message || "Autentificare eșuată! Verifică datele introduse.");
        }
    };

    return (
        <div>
            <GlobalMessage message={globalMessage} clearMessage={() => setGlobalMessage("")} />
            <h2 className="titlu">Conectare</h2>
            <div className="login">
                <form id="login-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Parolă" 
                        value={parola}
                        onChange={(e) => setParola(e.target.value)}
                        required 
                    />
                    <button type="submit">Login</button>
                    <span>Nu aveți cont? <a href="/register">Sign Up</a></span>
                </form>  
            </div>
        </div>
    );
};

export default Login;
