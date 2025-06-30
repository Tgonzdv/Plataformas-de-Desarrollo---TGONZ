import React, { useState } from "react";
import { authUtils } from "../utils/auth";
import "../css/nav.css";

const Nav = ({ onLogout }) => {
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
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <h2>🍕 PizzaYa</h2>
                </div>
                <div className="navbar-user-section">
                    <div className="navbar-user-info">
                        <div className="user-avatar">
                            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="user-greeting">
                            Hola, <strong>{currentUser?.username || 'Usuario'}</strong>
                        </span>
                    </div>
                    <div className="navbar-actions">
                        <a
                            href="/"
                            className="navbar-link"
                        >
                            <span>👤</span>
                            Perfil
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
    );
};

export default Nav;
