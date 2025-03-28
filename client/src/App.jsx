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
import Footer from "./components/Footer";
import PaginaLipsa from "./components/PaginaLipsa";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<> <Home /> <Footer /> </>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/sanctiuni" element={<Sanctiuni />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/notificari" element={<Notificari />} />
                    <Route path="/postare-noua" element={<PostareNoua />} />
                    <Route path="*" element={<PaginaLipsa />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
