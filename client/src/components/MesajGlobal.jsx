import React, { useEffect } from "react";
import "./styles/MesajGlobal.css";

const MesajGlobal = ({ message, clearMessage }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                clearMessage(); 
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [message]);

    if (!message) return null;

    return <div className="chenar-mesaj">{message}</div>;
};

export default MesajGlobal;
