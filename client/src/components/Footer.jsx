import React from "react";
import './styles/Footer.css';
import { useNavigate } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <a href="/despre">Despre</a>
                <a href="/contact">Contact</a>
                <a href="/regulament">Regulament</a>
                <a href="/statistici">Statistici</a>
            </div>
            <div className="copyright">
                &copy; {new Date().getFullYear()} Cafeneaua Economica
            </div>
        </footer>
    );
};

export default Footer;