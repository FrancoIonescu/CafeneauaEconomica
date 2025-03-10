import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const verificaSesiunea = async () => {
            try {
                const raspuns = await fetch(`${API_URL}/sesiune`, {
                    method: "GET",
                    credentials: "include",
                });

                if (raspuns.ok) {
                    const data = await raspuns.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Eroare la verificarea sesiunii:", error);
            }
            setLoading(false);  
        };

        verificaSesiunea();
    }, []);

    const register = async (nume_utilizator, email, parola, data_nastere) => {
        try {
            const raspuns = await fetch(`${API_URL}/inregistrare`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nume_utilizator, email, parola, data_nastere }),
                credentials: "include",
            });
    
            const data = await raspuns.json(); 

            if (!raspuns.ok) {
                throw new Error(data.message || "Înregistrarea a eșuat. Verificați datele introduse.");
            }

            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Eroare la înregistrare:", error);
            return { success: false, message: error.message };
        }
    };    

    const login = async (email, parola) => {
        try {
            const raspuns = await fetch(`${API_URL}/conectare`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, parola }),
                credentials: "include",
            });

            const data = await raspuns.json();

            if (!raspuns.ok) {
                throw new Error(data.message || "Conectarea a eșuat. Verificați datele introduse.");
            }

            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Eroare la autentificare:", error);
            return { success: false, message: error.message};
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/deconectare`, {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
        } catch (error) {
            console.error("Eroare la deconectare:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
