import React, { useEffect } from "react";
import "./styles/ErrorMessage.css";

const ErrorMessage = ({ message, clearMessage }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                clearMessage(); 
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [message]);

    if (!message) return null;

    return <div className="error-box">{message}</div>;
};

export default ErrorMessage;
