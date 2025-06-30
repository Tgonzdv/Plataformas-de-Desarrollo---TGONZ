import React from "react";

export default function AdminDashboard({ stats }) {
  return (
    <div className="admin-section">
      <h3>Dashboard</h3>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{stats.totalUsers}</div>
          <div className="admin-stat-label">Total Usuarios</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{stats.totalPizzas}</div>
          <div className="admin-stat-label">Total Pizzas</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{stats.totalOrders}</div>
          <div className="admin-stat-label">Total Pedidos</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{stats.pendingOrders}</div>
          <div className="admin-stat-label">Pedidos Pendientes</div>
        </div>
      </div>
    </div>
  );
}
