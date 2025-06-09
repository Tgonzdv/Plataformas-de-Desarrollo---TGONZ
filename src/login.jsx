import React, { useState } from "react"
import users from "./users.json"
import "./login.css"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(
            u => u.username === username && u.password === password
        );
        if (user) {
            setError("");
            alert(`Bienvenido ${user.role}: ${user.username}`);
        } else {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <main className="login">
            <header>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Login Icon"
                    width={64}
                    height={64}
                    style={{ marginBottom: 16 }}
                />
                <h1>Iniciar sesión</h1>
                <p className="login-subtitle">Accede a tu cuenta para continuar</p>
            </header>
            <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión" autoComplete="on">
                <div className="login-field">
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        placeholder="Tu usuario"
                        autoFocus
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                </div>
                <div className="login-field">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit">Ingresar</button>
                {error && <p role="alert">{error}</p>}
            </form>
            <footer className="login-footer">
                <small>
                    ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
                </small>
            </footer>
        </main>
    )
}

