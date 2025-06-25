import React, { useState } from "react";
import "../css/nav.css";

const Nav = ({ onLogout }) => {
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = () => {
        setLoggingOut(true);
        if (onLogout) onLogout();
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
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
        </nav>
    );
};

export default Nav;
