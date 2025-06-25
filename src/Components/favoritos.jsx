import React from "react";
import "../css/favoritos.css";

const Favoritos = ({ favoritos, onEliminarFavorito, pizzas }) => {
    return (
        <section className="favoritos-section">
            <h3 className="favoritos-title">Mis Favoritos</h3>
            {favoritos.length === 0 ? (
                <p className="favoritos-empty">No tienes favoritos.</p>
            ) : (
                <ul className="favoritos-list">
                    {favoritos.map((nombre, idx) => {
                        const pizza = pizzas.find(p => p.nombre === nombre);
                        return (
                            <li key={idx} className="favoritos-item">
                                <div className="favoritos-item-header">
                                    <span className="favoritos-nombre">{nombre}</span>
                                    {pizza && (
                                        <span className="favoritos-precio">${pizza.precio}</span>
                                    )}
                                </div>
                                {pizza && (
                                    <div className="favoritos-descripcion">{pizza.descripcion}</div>
                                )}
                                <button
                                    onClick={() => onEliminarFavorito(nombre)}
                                    className="favoritos-eliminar-btn"
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
