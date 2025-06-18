import React from "react";

export function Cart({ items, onRemove }) {
    return (
        <div className="cart">
            <h2>Carrito</h2>
            <ul>
                {items.map((item, idx) => (
                    <li key={idx}>
                        {item.nombre} - {item.precio}
                        <button onClick={() => onRemove(idx)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
