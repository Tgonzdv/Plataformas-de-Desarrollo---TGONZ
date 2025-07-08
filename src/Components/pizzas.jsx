import React from "react";
import "../css/pizza.css";

export default function Pizzas({ 
  pizzas = [], 
  favoritos = [], 
  onAgregarFavorito, 
  onAgregarCarrito,
  loadingPizzas = false 
}) {
    if (loadingPizzas) {
        return (
            <div className="pizzas-container">
                <div style={{ textAlign: 'center', padding: '50px', width: '100%' }}>
                    <h3>Cargando pizzas...</h3>
                </div>
            </div>
        );
    }

    if (pizzas.length === 0) {
        return (
            <div className="pizzas-container">
                <div style={{ textAlign: 'center', padding: '50px', width: '100%' }}>
                    <h3>No hay pizzas disponibles</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="pizzas-container">
            {pizzas.map((pizza) => {
                const isFavorito = favoritos.includes(pizza.nombre);
                return (
                    <div
                        key={pizza.nombre}
                        className="pizza-card"
                    >
                        <h4 className="pizza-title">
                            {pizza.nombre}
                        </h4>
                        <p className="pizza-desc">
                            {pizza.descripcion}
                        </p>
                        <p className="pizza-precio">
                            Precio: ${pizza.precio}
                        </p>
                        <button
                            onClick={() => onAgregarCarrito(pizza)}
                            className="pizza-btn-carrito"
                        >
                            Agregar al carrito
                        </button>
                        <br />
                        <button
                            onClick={() => !isFavorito && onAgregarFavorito(pizza.nombre)}
                            disabled={isFavorito}
                            className={`pizza-btn-favorito${isFavorito ? " favorito" : ""}`}
                        >
                            {isFavorito ? "Agregado" : "Agregar a Favoritos"}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
