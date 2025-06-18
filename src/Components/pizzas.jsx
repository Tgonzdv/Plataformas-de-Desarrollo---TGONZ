import React, { useState } from "react";
import PizzasData from "../Json/pizzas.json";

const Pizzas = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [pizzas] = useState(PizzasData);

    const handleAgregarFavorito = (nombre) => {
        if (!favoritos.includes(nombre)) {
            setFavoritos([...favoritos, nombre]);
        }
    };

    return (
        <section
            style={{
                background: "#f8f8f8",
                borderRadius: 10,
                padding: 24,
                marginBottom: 32,
                boxShadow: "0 2px 8px #0001",
            }}
        >
            <h3
                style={{
                    color: "#e67e22",
                    borderBottom: "1px solid #eee",
                    paddingBottom: 8,
                }}
            >
                Lista de Pizzas
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {pizzas.map((pizza, idx) => (
                    <li
                        key={idx}
                        style={{
                            marginBottom: 18,
                            padding: 12,
                            borderRadius: 8,
                            background: "#fff",
                            boxShadow: "0 1px 4px #0001",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontWeight: 600, fontSize: 18 }}>
                                {pizza.nombre}
                            </span>
                            <span style={{ color: "#27ae60", fontWeight: 500 }}>
                                ${pizza.precio}
                            </span>
                        </div>
                        <div style={{ color: "#555", marginTop: 4 }}>
                            {pizza.descripcion}
                        </div>
                        <button
                            onClick={() => handleAgregarFavorito(pizza.nombre)}
                            disabled={favoritos.includes(pizza.nombre)}
                            style={{
                                marginTop: 8,
                                background: favoritos.includes(pizza.nombre)
                                    ? "#ccc"
                                    : "#e67e22",
                                color: "#fff",
                                border: "none",
                                borderRadius: 5,
                                padding: "6px 16px",
                                cursor: favoritos.includes(pizza.nombre)
                                    ? "not-allowed"
                                    : "pointer",
                                fontWeight: 500,
                            }}
                        >
                            {favoritos.includes(pizza.nombre)
                                ? "En Favoritos"
                                : "Agregar a Favorito"}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Pizzas;
