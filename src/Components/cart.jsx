import React from "react";
import "../css/cart.css";

const Cart = ({ items, onRemove }) => {
    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <div className="cart-container">
            <h2 className="cart-title">Carrito de compras</h2>
            {items.length === 0 ? (
                <p className="cart-empty">El carrito está vacío.</p>
            ) : (
                <ul className="cart-list">
                    {items.map((item) => (
                        <li key={item.id} className="cart-item">
                            <div>
                                <div className="cart-item-name">{item.nombre}</div>
                                <div className="cart-item-details">
                                    Cantidad: <b>{item.cantidad}</b> &nbsp;|&nbsp; 
                                    Precio: <b>${item.precio}</b>
                                </div>
                                <div className="cart-item-total">
                                    Total: <b>${item.precio * item.cantidad}</b>
                                </div>
                            </div>
                            <button
                                className="cart-remove-btn"
                                onClick={() => onRemove(item.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="cart-total">
                Total: ${total}
            </div>
        </div>
    );
};

export default Cart;
