 import React from "react";

const Favoritos = ({ favoritos, onEliminarFavorito, pizzas }) => {
    return (
        <section style={{ background: "#f8f8f8", borderRadius: 10, padding: 24, boxShadow: "0 2px 8px #0001" }}>
            <h3 style={{ color: "#e74c3c", borderBottom: "1px solid #eee", paddingBottom: 8 }}>Mis Favoritos</h3>
            {favoritos.length === 0 ? (
                <p style={{ color: "#888", fontStyle: "italic" }}>No tienes favoritos.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {favoritos.map((nombre, idx) => {
                        const pizza = pizzas.find(p => p.nombre === nombre);
                        return (
                            <li key={idx} style={{ marginBottom: 18, padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 4px #0001" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>{nombre}</span>
                                    {pizza && (
                                        <span style={{ color: "#27ae60", fontWeight: 500 }}>${pizza.precio}</span>
                                    )}
                                </div>
                                {pizza && (
                                    <div style={{ color: "#555", marginTop: 4 }}>{pizza.descripcion}</div>
                                )}
                                <button
                                    onClick={() => onEliminarFavorito(nombre)}
                                    style={{
                                        marginTop: 8,
                                        background: "#e74c3c",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 5,
                                        padding: "6px 16px",
                                        cursor: "pointer",
                                        fontWeight: 500
                                    }}
                                >
                                    Eliminar de Favoritos
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default Favoritos;