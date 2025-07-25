import React, { useState, useEffect } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MesajGlobal from "./MesajGlobal";

const Login = () => {
    const [email, setEmail] = useState("");
    const [parola, setParola] = useState("");
    const [mesajGlobal, setMesajGlobal] = useState("");
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

        if (rezultat.succes) {
            navigate("/");
            window.location.reload();
        } else {
            setMesajGlobal(rezultat.mesaj || "Autentificare eșuată! Verifică datele introduse.");
        }
    };

    return (
        <div>
            <MesajGlobal mesaj={mesajGlobal} stergeMesaj={() => setMesajGlobal("")} />
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