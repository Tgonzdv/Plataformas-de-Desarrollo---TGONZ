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
                <div className="navbar-user-info">
                    <span>Bienvenido, {currentUser?.username || 'Usuario'}</span>
                </div>
                <div className="navbar-actions">
                    <a
                        href="/"
                        className="navbar-link"
                    >
                        Perfil
                    </a>
                    <button
                        onClick={handleLogout}
                        className="navbar-logout-btn"
                        disabled={loggingOut}
                    >
                        Logout
                    </button>
                    {loggingOut && (
                        <span className="navbar-logout-message">
                            Cerrando sesión...
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
