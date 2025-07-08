import React from "react";
import "../css/favoritos.css";

const Favoritos = ({ favoritos, onEliminarFavorito, pizzas, loadingFavorites }) => {
    if (loadingFavorites) {
        return (
            <section className="favoritos-section">
                <h3 className="favoritos-title">Mis Favoritos</h3>
                <p className="favoritos-empty">Cargando favoritos...</p>
            </section>
        );
    }

    return (
        <section className="favoritos-section">
            <h3 className="favoritos-title">Mis Favoritos</h3>
            {favoritos.length === 0 ? (
                <p className="favoritos-empty">No tienes favoritos.</p>
            ) : (
                <ul className="favoritos-list">
                    {favoritos.map((pizza) => {
                        return (
                            <li key={pizza.id} className="favoritos-item">
                                <div className="favoritos-item-header">
                                    <span className="favoritos-nombre">{pizza.nombre}</span>
                                    <span className="favoritos-precio">${pizza.precio}</span>
                                </div>
                                <div className="favoritos-descripcion">{pizza.descripcion}</div>
                                <button
                                    onClick={() => onEliminarFavorito(pizza.id)}
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
