import { useEffect, useState } from "react";
import './styles/Stiri.css';
import { useNavigate } from "react-router-dom";
import imagineProfilAnonim from "./images/profil-anonim.jpg";
import { useAuth } from "./AuthContext";

const Stiri = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stiri, setStiri] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const preiaStiri = async () => {
    try {
      const raspuns = await fetch(`${API_URL}/stiri`, {
        method: "GET",
        credentials: "include",
      });

      if (raspuns.ok) {
        const date = await raspuns.json();
        setStiri(date);
      } else {
        console.error("Eroare la preluarea știrilor.");
      }
    } catch (error) {
      console.error("Eroare la conectarea cu serverul:", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    preiaStiri();
  }, [user, loading, navigate]);

  if (loading) {
    return <p>Se încarcă știrile...</p>;
  }

  return (
    <div className="pagina-stiri">
      <h2 className="titlu">Buletin Informativ</h2>
      <div className="lista-stiri">
        {stiri.length > 0 ? (
          stiri.map((stire) => (
            <div className="stire" key={stire.id_stire}>
              <div className="header-stire">
                <img
                    src={stire.utilizator.imagine_profil ? `${API_URL}/imagini/${stire.utilizator.imagine_profil}` : imagineProfilAnonim}
                    alt="Profil"
                    className="imagine-profil-stire"
                />
                <div className="info-utilizator">
                  <strong>{stire.utilizator?.nume_utilizator}</strong>
                  <span>{new Date(stire.data_creare).toLocaleString()}</span>
                </div>
              </div>
              <h3 className="titlu-stire">{stire.titlu}</h3>
              <p className="continut">{stire.continut}</p>
              {stire.imagine_stire && (
                <img
                    src={`/imagini_stiri/${stire.imagine_stire}`}
                    alt="Stire"
                    className="imagine-stire"
                />
                )}
            </div>
          ))
        ) : (
          <p className="mesaj-fara-stiri">Nu există știri momentan.</p>
        )}
      </div>
    </div>
  );
};

export default Stiri;
