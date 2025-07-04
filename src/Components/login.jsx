﻿import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../Json/users.json";
import { authUtils } from "../utils/auth";
import "../css/login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(
            u => u.username === username && u.password === password
        );
        if (user) {
            setError("");
            // Guardar la sesión del usuario en localStorage usando la utilidad
            const success = authUtils.saveUser(user);
            
            if (success) {
                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/user");
                }
            } else {
                setError("Error al guardar la sesión. Inténtalo de nuevo.");
            }
        } else {
            setError("Usuario o contraseña incorrectos");
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
                    />
                </div>
                <button type="submit">Ingresar</button>
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
