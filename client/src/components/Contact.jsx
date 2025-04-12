import React from "react";
import './styles/Contact.css';
import imagineMail from "./images/email.png";
import imagineInstagram from "./images/instagram.png";
import imagineFacebook from "./images/facebook.png";

const Contact = () => {
    return (
        <div>
            <h2 className="titlu">Contact</h2>
            <div className="contact">
                <div className="contact-item">
                    <img src={imagineMail} alt="Email" />
                    <a href="mailto:cafeneauaeconomica@gmail.com">Email</a>
                </div>
                <div className="contact-item">
                    <img src={imagineInstagram} alt="Instagram" />
                    <a href="https://instagram.com/profilPersonal" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
                <div className="contact-item">
                    <img src={imagineFacebook} alt="Facebook" />
                    <a href="https://facebook.com/profilPersonal" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>  
            </div>
        </div>
    );
};

export default Contact;
