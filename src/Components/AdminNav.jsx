import React, { useState } from "react";
import { authUtils } from "../utils/auth";
import "../css/nav.css";

export default function AdminNav({ activeSection, setActiveSection, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const currentUser = authUtils.getCurrentUser();

  const handleLogout = () => {
    setLoggingOut(true);
    authUtils.logout();
    if (onLogout) onLogout();
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <>
      {/* Top Navigation Bar - Similar to client nav */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h2>🍕 PizzYa - Admin</h2>
          </div>
          <div className="navbar-user-section">
            <div className="navbar-user-info">
              <div className="user-avatar">
                {currentUser?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="user-greeting">
                Hola, <strong>Admin {currentUser?.username || 'Usuario'}</strong>
              </span>
            </div>
            <div className="navbar-actions">
              <a
                href="/admin"
                className="navbar-link"
              >
                <span>⚙️</span>
                Panel
              </a>
              <button
                onClick={handleLogout}
                className={`navbar-logout-btn ${loggingOut ? 'logging-out' : ''}`}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <>
                    <span className="spinner"></span>
                    Cerrando...
                  </>
                ) : (
                  <>
                    <span>🚪</span>
                    Salir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Panel Navigation */}
      <nav className="admin-nav">
        <button 
          className={`admin-nav-btn ${activeSection === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveSection("dashboard")}
        >
          📊 Dashboard
        </button>
        <button 
          className={`admin-nav-btn ${activeSection === "users" ? "active" : ""}`}
          onClick={() => setActiveSection("users")}
        >
          👥 Usuarios
        </button>
        <button 
          className={`admin-nav-btn ${activeSection === "pizzas" ? "active" : ""}`}
          onClick={() => setActiveSection("pizzas")}
        >
          🍕 Pizzas
        </button>
        <button 
          className={`admin-nav-btn ${activeSection === "orders" ? "active" : ""}`}
          onClick={() => setActiveSection("orders")}
        >
          📋 Pedidos
        </button>
      </nav>
    </>
  );
}
