import React, { useState, useEffect } from "react";
import "./styles/Register.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MesajGlobal from "./MesajGlobal";

const Register = () => {
    const [numeUtilizator, setNumeUtilizator] = useState("");
    const [email, setEmail] = useState("");
    const [parola, setParola] = useState("");
    const [confirmareParola, setConfirmareParola] = useState("");
    const [dataNastere, setDataNastere] = useState("");
    const [mesajGlobal, setMesajGlobal] = useState("");
    const { user, register } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); 
        }
    }, [user, navigate]);
    
    const trimiteInregistrare = async (event) => {
        event.preventDefault();
        if (parola !== confirmareParola) {
            setMesajGlobal("Parolele nu se potrivesc!");
            return;
        }
        const rezultat = await register(numeUtilizator, email, parola, dataNastere);
        if (rezultat.succes) {
            navigate("/");
            window.location.reload();
        } else {
            setMesajGlobal(rezultat.mesaj || "Înregistrare eșuată! Verifică datele introduse.");
        }
    };

    return (
        <div>
            <MesajGlobal mesaj={mesajGlobal} stergeMesaj={() => setMesajGlobal("")} />
            <h2 className="titlu">Înregistrare</h2>
            <div className="register">
                <form id="register-form" onSubmit={trimiteInregistrare}>
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
                        placeholder="parolă (minim 10 caractere)" 
                        value={parola}
                        onChange={(e) => setParola(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="confirmare parolă" 
                        value={confirmareParola}
                        onChange={(e) => setConfirmareParola(e.target.value)}
                        required
                    />
                    <label htmlFor="dataNastere">Data nașterii:</label>
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