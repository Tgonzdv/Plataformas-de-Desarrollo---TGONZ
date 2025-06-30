import React from "react";

export default function AdminOrders({ 
  pedidos, 
  getUsernameById, 
  handleUpdateOrderStatus 
}) {
  return (
    <div className="admin-section">
      <h3>Gestión de Pedidos</h3>
      
      <div className="admin-orders-grid">
        {pedidos.map(pedido => (
          <div key={pedido.orderId} className="admin-order-card">
            <div className="admin-order-header">
              <h4>Pedido #{pedido.orderId}</h4>
              <span className={`admin-order-status status-${pedido.status}`}>
                {pedido.status.toUpperCase()}
              </span>
            </div>
            
            <p><strong>Cliente:</strong> {getUsernameById(pedido.userId)}</p>
            <p><strong>Fecha:</strong> {pedido.fecha}</p>
            
            <div className="admin-order-items">
              <strong>Items:</strong>
              <ul>
                {pedido.items.map((item, index) => (
                  <li key={index}>
                    {item.nombre} x{item.cantidad}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="admin-order-total">
              Total: ${pedido.total.toLocaleString()}
            </div>
            
            {pedido.status === "pendiente" && (
              <div className="admin-actions" style={{marginTop: "15px"}}>
                <button 
                  onClick={() => handleUpdateOrderStatus(pedido.orderId, "aceptado")}
                  className="admin-btn admin-btn-success"
                >
                  Aceptar
                </button>
                <button 
                  onClick={() => handleUpdateOrderStatus(pedido.orderId, "cancelado")}
                  className="admin-btn admin-btn-danger"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
