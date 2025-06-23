import React from "react";

const Cart = ({ items, onRemove }) => {
    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <div className="cart-container" style={{
            maxWidth: 400,
            margin: "40px auto",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            padding: 24
        }}>
            <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 24, color: "#333" }}>Carrito de compras</h2>
            {items.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center" }}>El carrito está vacío.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map((item) => (
                        <li key={item.id} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 0",
                            borderBottom: "1px solid #f0f0f0"
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, color: "#222" }}>{item.nombre}</div>
                                <div style={{ fontSize: 14, color: "#666" }}>
                                    Cantidad: <b>{item.cantidad}</b> &nbsp;|&nbsp; 
                                    Precio: <b>${item.precio}</b>
                                </div>
                                <div style={{ fontSize: 13, color: "#888" }}>
                                    Total: <b>${item.precio * item.cantidad}</b>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemove(item.id)}
                                style={{
                                    background: "#ff4d4f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "8px 14px",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    transition: "background 0.2s"
                                }}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div style={{
                marginTop: 24,
                fontWeight: 700,
                fontSize: 18,
                textAlign: "right",
                color: "#222"
            }}>
                Total: ${total}
            </div>
        </div>
    );
};

export default Cart;
