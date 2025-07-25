import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Sanctiuni from "./components/Sanctiuni";
import Profil from "./components/Profil"; 
import Notificari from "./components/Notificari";
import PostareNoua from "./components/PostareNoua";
import Stiri from "./components/Stiri";
import Footer from "./components/Footer";
import Despre from "./components/Despre";
import Contact from "./components/Contact";
import Regulament from "./components/Regulament";
import Statistici from "./components/Statistici";
import PaginaLipsa from "./components/PaginaLipsa";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/sanctiuni" element={<Sanctiuni />} />
                    <Route path="/profil/:id" element={<Profil />} />
                    <Route path="/notificari" element={<Notificari />} />
                    <Route path="/postare" element={<PostareNoua />} />
                    <Route path="/stiri" element={<Stiri />} />
                    <Route path="/despre" element={<Despre />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/regulament" element={<Regulament />} />
                    <Route path="/statistici" element={<Statistici />} />
                    <Route path="*" element={<PaginaLipsa />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

export default App;
