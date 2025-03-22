import React from "react";
import './styles/Footer.css';
import { useNavigate } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <a href="/about">Despre</a>
                <a href="/contact">Contact</a>
                <a href="/rules">Regulament</a>
                <a href="/statistics">Statistici</a>
                <a href="/social">Social</a>
            </div>
            <div className="copyright">
                &copy; {new Date().getFullYear()} Cafeneaua Economica
            </div>
        </footer>
    );
};

export default Footer;