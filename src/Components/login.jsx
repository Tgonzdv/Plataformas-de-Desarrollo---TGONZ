import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/authAPI";
import { authUtils } from "../utils/auth";
import "../css/login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Verificar si ya hay una sesión activa al cargar el componente
    useEffect(() => {
        const currentUser = authUtils.getCurrentUser();
        if (currentUser) {
            if (currentUser.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await authAPI.login(username, password);
            
            if (response.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch (error) {
            setError(error.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login">
            <header>
                <h1>🍕PizzaYa</h1>
                <h2>Iniciar sesión</h2>
            </header>
        
            <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión" autoComplete="on">
                <div>
                    <label htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        placeholder="Ingresa tu usuario"
                        autoFocus
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoComplete="username"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Ingresar"}
                </button>
                {error && <p role="alert">{error}</p>}
            </form>
           
            <footer>
                <small>
                    ¿Olvidaste tu contraseña? <a href="#" onClick={(e) => e.preventDefault()}>Recupérala aquí</a>
                </small>
            </footer>
        </main>
    );
}
