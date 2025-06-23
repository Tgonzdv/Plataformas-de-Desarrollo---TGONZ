import React, { useState } from "react";

const Nav = ({ onLogout }) => {
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = () => {
        setLoggingOut(true);
        if (onLogout) onLogout();
        setTimeout(() => {
            window.location.href = "/";
        }, 1500); // 1.5 segundos para mostrar el mensaje
    };

    return (
        <nav style={{
            width: '100%',
            background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
            padding: '0.75rem 2rem',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <a
                    href="/"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                    }}
                    onMouseOver={e => e.target.style.color = '#ffd700'}
                    onMouseOut={e => e.target.style.color = '#fff'}
                >
                    Perfil
                </a>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '0.5rem 1.5rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(221,36,118,0.15)',
                        transition: 'background 0.2s, transform 0.1s'
                    }}
                    onMouseOver={e => e.target.style.background = 'linear-gradient(90deg, #dd2476 0%, #ff512f 100%)'}
                    onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)'}
                    disabled={loggingOut}
                >
                    Logout
                </button>
                {loggingOut && (
                    <span style={{
                        marginLeft: '1rem',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '1rem',
                        background: '#232526cc',
                        padding: '0.5rem 1rem',
                        borderRadius: '10px'
                    }}>
                        Cerrando sesión...
                    </span>
                )}
            </div>
        </nav>
    );
};

export default Nav;