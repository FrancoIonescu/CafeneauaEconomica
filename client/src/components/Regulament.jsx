import React from "react";
import './styles/Regulament.css';

const Regulament = () => {
    return (
        <div>
            <h1 className="titlu">Regulament</h1>
            <div className="regulament">
                <ul className="regulament-list">
                    <li><span className="icon">☕️</span> Tratează toți utilizatorii cu respect.</li>
                    <li><span className="icon">☕️</span> Evită atacurile personale și mesajele jignitoare.</li>
                    <li><span className="icon">☕️</span> Nu tolerăm discursul instigator la ură sau discriminarea.</li>
                    <li><span className="icon">☕️</span> Nu posta informații false sau înșelătoare.</li>
                    <li><span className="icon">☕️</span> Postează mesaje relevante și la subiect.</li>
                    <li><span className="icon">☕️</span> Evită spam-ul și conținutul ilegal.</li>
                    <li><span className="icon">☕️</span> Menționează sursa informațiilor preluate dacă este cazul.</li>
                    <li><span className="icon">☕️</span> Nu distribui materiale protejate de drepturi de autor fără permisiune.</li>
                    <li><span className="icon">☕️</span> Nu face reclamă excesivă la produse sau servicii.</li>
                    <li><span className="icon">☕️</span> Fii responsabil pentru securitatea contului tău.</li>
                    <li><span className="icon">☕️</span> Nu distribui parole sau date personale pe forum.</li>
                    <li><span className="icon">☕️</span> Nu crea mai multe conturi pentru a manipula discuțiile.</li>
                    <li><span className="icon">☕️</span> Moderatorii pot edita sau șterge postări ce încalcă regulile.</li>
                    <li><span className="icon">☕️</span> Dacă ai o problemă cu o decizie a moderatorilor, contactează echipa forumului.</li>

                </ul>
            </div>
        </div>
    );
};

export default Regulament;
