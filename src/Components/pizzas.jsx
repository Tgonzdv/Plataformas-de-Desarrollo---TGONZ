import React from "react";
import PizzasData from "../Json/pizzas.json";

export default function Pizzas({ favoritos = [], onAgregarFavorito, onAgregarCarrito }) {
    const pizzas = PizzasData;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
            {pizzas.map((pizza) => {
                const isFavorito = favoritos.includes(pizza.nombre);
                return (
                    <div
                        key={pizza.nombre}
                        style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            padding: "24px",
                            width: "280px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            transition: "transform 0.2s",
                            marginTop: "24px", // agregado margin top
                        }}
                    >
                        <h4 style={{ margin: "0 0 12px 0", color: "#d35400", fontSize: "1.5rem" }}>
                            {pizza.nombre}
                        </h4>
                        <p style={{ color: "#555", marginBottom: "12px", textAlign: "center" }}>
                            {pizza.descripcion}
                        </p>
                        <p style={{ color: "#16a085", fontWeight: "bold", marginBottom: "20px", fontSize: "1.1rem" }}>
                            Precio: ${pizza.precio}
                        </p>
                        <button
                            onClick={() => onAgregarCarrito(pizza)}
                            style={{
                                background: "#2980b9",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "10px 20px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                marginTop: "10px"
                            }}
                        >
                            Agregar al carrito
                        </button>
                        <br />
                        <button
                            onClick={() => !isFavorito && onAgregarFavorito(pizza.nombre)}
                            disabled={isFavorito}
                            style={{
                                background: isFavorito ? "#bdc3c7" : "#27ae60",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "10px 20px",
                                cursor: isFavorito ? "not-allowed" : "pointer",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                boxShadow: "0 1px 4px rgba(39,174,96,0.15)",
                                transition: "background 0.2s",
                            }}
                        >
                            {isFavorito ? "Agregado" : "Agregar a Favoritos"}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
