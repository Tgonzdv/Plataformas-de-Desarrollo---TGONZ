import { useState } from "react";
import favoritosData from "../Json/favoritos.json";
import PizzasData from "../Json/pizzas.json";
import carritoData from "../Json/carrito.json";

export default function UserHome() {
  // Filtrar por userid 2 que es cliente Jorge
  const user = favoritosData.find(u => u.user_id === 2);

  // Estados
  const [favoritos, setFavoritos] = useState(user?.favoritos || []);
  const [carrito] = useState(Array.isArray(carritoData) ? carritoData : carritoData.carrito || []);

  const pizzas = PizzasData;

  // Simulación de guardar/eliminar favoritos en JSON
  const guardarFavoritosEnJson = (nuevosFavoritos) => {
    // Aquí iría la lógica real para guardar en backend o localStorage
    console.log("Favoritos guardados en JSON:", nuevosFavoritos);
  };

  // Función para agregar a favoritos
  const handleAgregarFavorito = (nombre) => {
    if (!favoritos.includes(nombre)) {
      const nuevosFavoritos = [...favoritos, nombre];
      setFavoritos(nuevosFavoritos);
      guardarFavoritosEnJson(nuevosFavoritos);
    }
  };

  // Función para eliminar de favoritos
  const handleEliminarFavorito = (nombre) => {
    const nuevosFavoritos = favoritos.filter(fav => fav !== nombre);
    setFavoritos(nuevosFavoritos);
    guardarFavoritosEnJson(nuevosFavoritos);
  };

  // Calcular total del carrito
  const totalCarrito = Array.isArray(carrito) ? carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0) : 0;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif", position: "relative" }}>
      {/* Contenido principal */}
      <div style={{ width: "65%", float: "left" }}>
        <h2 style={{ textAlign: "center", color: "#2c3e50" }}>Bienvenido, Jorge</h2>

        <section style={{ background: "#f8f8f8", borderRadius: 10, padding: 24, marginBottom: 32, boxShadow: "0 2px 8px #0001" }}>
          <h3 style={{ color: "#e67e22", borderBottom: "1px solid #eee", paddingBottom: 8 }}>Lista de Pizzas</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pizzas.map((pizza, idx) => (
              <li key={idx} style={{ marginBottom: 18, padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 4px #0001" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{pizza.nombre}</span>
                  <span style={{ color: "#27ae60", fontWeight: 500 }}>${pizza.precio}</span>
                </div>
                <div style={{ color: "#555", marginTop: 4 }}>{pizza.descripcion}</div>
                <button
                  onClick={() => handleAgregarFavorito(pizza.nombre)}
                  disabled={favoritos.includes(pizza.nombre)}
                  style={{
                    marginTop: 8,
                    background: favoritos.includes(pizza.nombre) ? "#ccc" : "#e67e22",
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    padding: "6px 16px",
                    cursor: favoritos.includes(pizza.nombre) ? "not-allowed" : "pointer",
                    fontWeight: 500
                  }}
                >
                  {favoritos.includes(pizza.nombre) ? "En Favoritos" : "Agregar a Favorito"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ background: "#f8f8f8", borderRadius: 10, padding: 24, boxShadow: "0 2px 8px #0001" }}>
          <h3 style={{ color: "#e74c3c", borderBottom: "1px solid #eee", paddingBottom: 8 }}>Mis Favoritos</h3>
          {favoritos.length === 0 ? (
            <p style={{ color: "#888", fontStyle: "italic" }}>No tienes favoritos.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {favoritos.map((nombre, idx) => {
                const pizza = pizzas.find(p => p.nombre === nombre);
                return (
                  <li key={idx} style={{ marginBottom: 18, padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 4px #0001" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: 18 }}>{nombre}</span>
                      {pizza && (
                        <span style={{ color: "#27ae60", fontWeight: 500 }}>${pizza.precio}</span>
                      )}
                    </div>
                    {pizza && (
                      <div style={{ color: "#555", marginTop: 4 }}>{pizza.descripcion}</div>
                    )}
                    <button
                      onClick={() => handleEliminarFavorito(nombre)}
                      style={{
                        marginTop: 8,
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "6px 16px",
                        cursor: "pointer",
                        fontWeight: 500
                      }}
                    >
                      Eliminar de Favoritos
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Carrito a la derecha */}
     





      <div style={{ clear: "both" }} />
    </div>
  );
}
