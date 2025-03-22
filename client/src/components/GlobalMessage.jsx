import React, { useEffect } from "react";
import "./styles/GlobalMessage.css";

const GlobalMessage = ({ message, clearMessage }) => {
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

export default GlobalMessage;
