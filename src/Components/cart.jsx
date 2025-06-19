import React from "react";

const Cart = ({ items, onRemove }) => {
    return (
        <div className="cart">
            <h2>Carrito</h2>
            <ul>
                {items.map((item, idx) => (
                    <li key={item.id}>
                        {item.nombre} - Cantidad: {item.cantidad} - Precio unitario: {item.precio} - Total: {item.precio * item.cantidad}
                        <button onClick={() => onRemove(item.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;
