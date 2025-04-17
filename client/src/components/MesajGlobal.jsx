import React, { useEffect } from "react";
import "./styles/MesajGlobal.css";

const MesajGlobal = ({ mesaj, stergeMesaj }) => {
    useEffect(() => {
        if (mesaj) {
            const timer = setTimeout(() => {
                stergeMesaj(); 
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [mesaj]);

    if (!mesaj) return null;

    return <div className="chenar-mesaj">{mesaj}</div>;
};

export default MesajGlobal;
