import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/authAPI";
import { authUtils } from "../utils/auth";
import "../css/login.css";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError("El nombre de usuario es requerido");
            return false;
        }
        
        if (!formData.email.trim()) {
            setError("El email es requerido");
            return false;
        }
        
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("El email no tiene un formato válido");
            return false;
        }
        
        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const userData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: "user"  
            };

            const response = await authAPI.register(userData);
            
        
            if (response.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch (error) {
            setError(error.message || "Error al registrar usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login">
            <header>
                <h1>🍕PizzaYa</h1>
                <h2>Crear cuenta</h2>
            </header>
        
            <form onSubmit={handleSubmit} aria-label="Formulario de registro" autoComplete="on">
                <div>
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        placeholder="Ingresa tu nombre de usuario"
                        autoFocus
                        value={formData.username}
                        onChange={handleInputChange}
                        autoComplete="username"
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="Ingresa tu email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
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
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        disabled={loading}
                        minLength={6}
                    />
                </div>
                
                <div>
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        placeholder="Confirma tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        disabled={loading}
                        minLength={6}
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Registrarse"}
                </button>
                
                {error && <p role="alert" className="error-message">{error}</p>}
            </form>
           
            <footer>
                <small>
                    ¿Ya tienes una cuenta? <button 
                        type="button" 
                        onClick={() => navigate("/")} 
                        className="link-button"
                        disabled={loading}
                    >
                        Inicia sesión aquí
                    </button>
                </small>
            </footer>
        </main>
    );
}
