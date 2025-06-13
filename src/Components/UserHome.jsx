import { useState } from "react";
import favoritosData from "../Json/favoritos.json";

import PizzasData from "../Json/pizzas.json";
export default function UserHome() {

  // Filtrar por userid 2 que es cliente Jorge
  const user = favoritosData.find(u => u.user_id === 2);
  const [favoritos] = useState(user?.favoritos || []);

  const pizzas = PizzasData;

  return (



    <div>


      <h2>Bienvenido, Usuario</h2>

      <h2>Lista de Pizzas</h2>
      <ul>
        {pizzas.map((pizza, idx) => (
          <li key={idx}>{pizza.nombre}</li>
        ))}
      </ul>

      <h2>Mis Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>No tienes favoritos.</p>
      ) : (
        <ul>
          {favoritos.map((nombre, idx) => (
            <li key={idx}>{nombre}</li>
          ))}
        </ul>
      )}


    </div>
  );
}
