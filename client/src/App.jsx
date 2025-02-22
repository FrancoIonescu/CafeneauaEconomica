import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profil from "./components/Profil"; 

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profil" element={<Profil />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
