import { useState } from "react";
import favoritosData from "../Json/favoritos.json";

import PizzasData from "../Json/pizzas.json";
export default function UserHome() {

  // Filtrar por userid 2 que es cliente Jorge
  const user = favoritosData.find(u => u.user_id === 2);
  const [favoritos] = useState(user?.favoritos || []);

  const pizzas = PizzasData;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif" }}>
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
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
