import { useEffect, useState } from "react";
import './styles/Notificari.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MesajGlobal from "./MesajGlobal";

const Notificari = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [notificari, setNotificari] = useState([]);
  const [mesajGlobal, setMesajGlobal] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const preiaNotificari = async () => {
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
      console.error("Eroare la conectarea cu serverul:", error);
    }
  };

  const stergeNotificare = async (idNotificare) => {
    try {
      const raspuns = await fetch(`${API_URL}/notificari`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_notificare: idNotificare }),
        credentials: "include",
      });

      if (raspuns.ok) {
        setMesajGlobal("Notificare ștearsă cu succes.");
        preiaNotificari();
      } else {
        console.error("Eroare la ștergerea notificării.");
      }
    } catch (error) {
      console.error("Eroare la conectarea cu serverul:", error);
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    preiaNotificari();
  }, [user, loading, navigate]); 

  if (loading) {
    return <p>Se încarcă notificările...</p>;
  }

  return (
    <div>
      <MesajGlobal mesaj={mesajGlobal} stergeMesaj={() => setMesajGlobal("")} />
      <h2 className="titlu">Notificari</h2>
        <div className="notificari">
            {notificari.length > 0 ? (
            <ul>
            {notificari.map((notificare) => (
                <li key={notificare.id_notificare}>
                {notificare.mesaj} - {new Date(notificare.data_notificare).toLocaleString()}
                <button 
                    className="notificare-button" 
                    onClick={() => stergeNotificare(notificare.id_notificare)}
                >   
                    Șterge
                </button>
                </li>
            ))}
            </ul>
            ) : (
                <p>Nu ai nicio notificare.</p>
            )}
        </div>
    </div>
  );
};

export default Notificari;
