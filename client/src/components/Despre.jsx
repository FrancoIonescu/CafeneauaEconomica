import React from "react";
import './styles/Despre.css';

const Despre = () => {
    return (
        <div>
            <h2 className="titlu">Despre</h2>
            <div className="despre">
                <p className="despre-text">
                    Acesta este un forum online dedicat discuțiilor din domeniul economic, creat pentru toți cei interesați de lumea finanțelor și a economiei.
                </p>
                <p className="despre-text">
                    Utilizatorii pot posta și explora subiecte diverse, cum ar fi criptomonede, investiții, economisire, economia României, economia globală și multe altele. Ne propunem să oferim un spațiu deschis pentru schimb de idei, perspective și informații relevante.
                </p>
                <p className="despre-text">
                    Vă încurajăm să participați activ la discuții, să adresați întrebări și să contribuiți cu propriile cunoștințe pentru a construi împreună o comunitate informată și pasionată de economie.
                </p>
                <p className="despre-text">
                    Vă mulțumim că faceți parte din această comunitate!
                </p>
            </div>
        </div>
    );
};

export default Despre;
