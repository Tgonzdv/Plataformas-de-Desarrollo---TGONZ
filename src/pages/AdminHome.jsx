import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/auth";

export default function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado y es admin
    if (!authUtils.isAuthenticated()) {
      navigate("/");
      return;
    }
    
    if (!authUtils.isAdmin()) {
      navigate("/user"); // Redirigir a user home si no es admin
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    authUtils.logout();
    navigate("/");
  };

  const currentUser = authUtils.getCurrentUser();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Bienvenido, Administrador {currentUser?.username}</h2>
        <button 
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Cerrar Sesión
        </button>
      </div>
      <p>Panel de administración - Funcionalidades de admin aquí</p>
    </div>
  );
}