import React, { useState } from "react"
import users from "./users.json" // Importa el JSON de usuarios

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
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
        </div>
    )
}

