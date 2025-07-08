import React, { useState } from "react";

export default function AdminOrders({ 
  pedidos, 
  getUsernameById, 
  handleUpdateOrderStatus,
  loadingOrders,
  onRefresh 
}) {
  const [updatingOrders, setUpdatingOrders] = useState(new Set());

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Agregar el pedido al set de pedidos que se están actualizando
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    try {
      await handleUpdateOrderStatus(orderId, newStatus);
    } finally {
      // Remover el pedido del set de pedidos que se están actualizando
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (loadingOrders) {
    return (
      <div className="admin-section">
        <h3>Gestión de Pedidos</h3>
        <div className="loading-message">
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="admin-section">
        <h3>Gestión de Pedidos</h3>
        <div className="no-orders-message">
          <p>No hay pedidos disponibles.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-section">
      <div className="section-header">
        <h3>Gestión de Pedidos</h3>
        <button 
          onClick={onRefresh} 
          className="admin-btn admin-btn-primary"
          disabled={loadingOrders}
        >
          {loadingOrders ? "Cargando..." : "🔄 Refrescar"}
        </button>
      </div>
      
      <div className="orders-summary">
        <div className="summary-card">
          <span className="summary-number">{pedidos.length}</span>
          <span className="summary-label">Total Pedidos</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{pedidos.filter(p => p.status === "pendiente").length}</span>
          <span className="summary-label">Pendientes</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{pedidos.filter(p => p.status === "aceptado").length}</span>
          <span className="summary-label">Aceptados</span>
        </div>
      </div>
      
      <div className="admin-orders-grid">
        {pedidos.map(pedido => (
          <div key={pedido.id} className="admin-order-card">
            <div className="admin-order-header">
              <h4>Pedido #{pedido.id}</h4>
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
                  onClick={() => handleStatusUpdate(pedido.id, "aceptado")}
                  className="admin-btn admin-btn-success"
                  disabled={updatingOrders.has(pedido.id)}
                >
                  {updatingOrders.has(pedido.id) ? "Procesando..." : "Aceptar"}
                </button>
                <button 
                  onClick={() => handleStatusUpdate(pedido.id, "cancelado")}
                  className="admin-btn admin-btn-danger"
                  disabled={updatingOrders.has(pedido.id)}
                >
                  {updatingOrders.has(pedido.id) ? "Procesando..." : "Cancelar"}
                </button>
              </div>
            )}

            {pedido.status === "aceptado" && (
              <div className="admin-actions" style={{marginTop: "15px"}}>
                <button 
                  onClick={() => handleStatusUpdate(pedido.id, "en_preparacion")}
                  className="admin-btn admin-btn-warning"
                  disabled={updatingOrders.has(pedido.id)}
                >
                  {updatingOrders.has(pedido.id) ? "Procesando..." : "En Preparación"}
                </button>
                <button 
                  onClick={() => handleStatusUpdate(pedido.id, "cancelado")}
                  className="admin-btn admin-btn-danger"
                  disabled={updatingOrders.has(pedido.id)}
                >
                  {updatingOrders.has(pedido.id) ? "Procesando..." : "Cancelar"}
                </button>
              </div>
            )}

            {pedido.status === "en_preparacion" && (
              <div className="admin-actions" style={{marginTop: "15px"}}>
                <button 
                  onClick={() => handleStatusUpdate(pedido.id, "entregado")}
                  className="admin-btn admin-btn-success"
                  disabled={updatingOrders.has(pedido.id)}
                >
                  {updatingOrders.has(pedido.id) ? "Procesando..." : "Marcar como Entregado"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
