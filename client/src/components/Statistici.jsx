import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import './styles/Statistici.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Statistici = () => {
    const [statistici, setStatistici] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const obtineStatistici = async () => {
            try {
                const raspuns = await fetch(`${API_URL}/statistici`);
                if (!raspuns.ok) {
                    throw new Error("Eroare la preluarea statisticilor");
                }
                const date = await raspuns.json();
                setStatistici(date);
            } catch (error) {
                console.error("Eroare:", error);
            }
        };
        obtineStatistici();
    }, [statistici]);

    if (!statistici) return <p>Se încarcă datele...</p>;

    const statisticiGenerale = {
        labels: ["Postări", "Comentarii", "Aprecieri", "Utilizatori"],
        datasets: [
            {
                label: "Număr total",
                data: [
                    statistici.numarPostari,
                    statistici.numarComentarii,
                    statistici.numarAprecieri,
                    statistici.numarUtilizatori
                ],
                backgroundColor: [
                    "#4e73df",
                    "#1cc88a", 
                    "#36b9cc",
                    "#f6c23e" 
                ]
            }
        ]
    };

    const postariPeCategorii = {
        labels: statistici.postariPeCategorii.map(categorie => categorie.categorie.nume_categorie),
        datasets: [
            {
                label: "Distribuție Postări",
                data: statistici.postariPeCategorii.map(categorie => categorie.numar_postari),
                backgroundColor: [
                    "#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#9b59b6", "#ff6347", "#48C9B0", "#F39C12", "#2980B9"
                ],
                borderWidth: 1
            }
        ]
    };

    const top10UtilizatoriAprecieri = {
        labels: statistici.topUtilizatoriAprecieri.map(user => user.nume_utilizator),
        datasets: [
            {
                label: "Top 10 utilizatori (aprecieri primite)",
                data: statistici.topUtilizatoriAprecieri.map(user => user.total_aprecieri),
                backgroundColor: "#4e73df"
            }
        ]
    };

    const top10UtilizatoriPostari = {
        labels: statistici.topUtilizatoriPostari.map(user => user.nume_utilizator),  
        datasets: [
            {
                label: "Top 10 utilizatori (postări)",
                data: statistici.topUtilizatoriPostari.map(user => user.total_postari),
                backgroundColor: "#1cc88a"
            }
        ]
    }

    return (
        <div>
            <h2 className="titlu">Statistici</h2>
            
            <div className="statistici">
                <div className="grafic">
                    <h3>Statistici Generale</h3>
                    <Bar data={statisticiGenerale} options={{ responsive: true }} />
                </div>
                
                <div className="grafic">
                    <h3>Distribuție Postări pe Categorii</h3>
                    <Pie data={postariPeCategorii} options={{ responsive: true }} />
                </div>
                
                <div className="grafic">
                    <h3>Top 10 Utilizatori - Aprecieri</h3>
                    <Bar data={top10UtilizatoriAprecieri} options={{ responsive: true }} />
                </div>
                
                <div className="grafic">
                    <h3>Top 10 Utilizatori - Postări</h3>
                    <Bar data={top10UtilizatoriPostari} options={{ responsive: true }} />
                </div>
                
                <div className="grafic">
                    <h3>Detalii Postări Populare - Aprecieri</h3>
                    <table className="postari-table">
                        <thead>
                            <tr>
                                <th>ID Postare</th>
                                <th>Autor</th>
                                <th>Aprecieri</th>
                                <th>Conținut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistici.topPostariAprecieri.map(post => (
                                <tr key={post.id_postare}>
                                    <td>{post.id_postare}</td>
                                    <td>{post.autor_nume}</td>
                                    <td>{post.numar_aprecieri}</td>
                                    <td className="continut-cell">
                                        {post.continut.length > 50 
                                            ? `${post.continut.substring(0, 50)}...` 
                                            : post.continut}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grafic">
                    <h3>Detalii Postări Populare - Comentarii</h3>
                    <table className="postari-table">
                        <thead>
                            <tr>
                                <th>ID Postare</th>
                                <th>Autor</th>
                                <th>Comentarii</th>
                                <th>Conținut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistici.topPostariComentarii.map(post => (
                                <tr key={post.id_postare}>
                                    <td>{post.id_postare}</td>
                                    <td>{post.autor_nume}</td>
                                    <td>{post.numar_comentarii}</td>
                                    <td className="continut-cell">
                                        {post.continut.length > 50 
                                            ? `${post.continut.substring(0, 50)}...` 
                                            : post.continut}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Statistici;
