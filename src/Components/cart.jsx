import React from "react";
import "../css/cart.css";

const Cart = ({ items, onRemove, loading = false }) => {
    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <div className="cart-container">
            <h2 className="cart-title">Carrito de compras</h2>
            {loading ? (
                <p className="cart-empty">Cargando carrito...</p>
            ) : items.length === 0 ? (
                <p className="cart-empty">El carrito está vacío.</p>
            ) : (
                <ul className="cart-list">
                    {items.map((item) => (
                        <li key={item.id} className="cart-item">
                            <div>
                                <div className="cart-item-name">{item.nombre}</div>
                                <div className="cart-item-details">
                                    Cantidad: <b>{item.cantidad}</b> &nbsp;|&nbsp; 
                                    Precio: <b>${item.precio.toLocaleString()}</b>
                                </div>
                                <div className="cart-item-total">
                                    Total: <b>${(item.precio * item.cantidad).toLocaleString()}</b>
                                </div>
                            </div>
                            <button
                                className="cart-remove-btn"
                                onClick={() => onRemove(item.id)}
                                disabled={loading}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="cart-total">
                Total: ${total.toLocaleString()}
            </div>
            {items.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <button 
                        className="cart-order-btn"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        disabled={loading}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                        Realizar Pedido
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
