import { useState } from "react";
import favoritosData from "../Json/favoritos.json";
import PizzasData from "../Json/pizzas.json";
import carritoData from "../Json/carrito.json";
import Pizzas from './pizzas';
import Favoritos from './favoritos';
import Cart from './cart';
import Nav from './nav';


export default function UserHome() {
  // Filtrar por userid 2 que es cliente Jorge
  const user = favoritosData.find(u => u.user_id === 2);

  // Estados
  const [favoritos, setFavoritos] = useState(user?.favoritos || []);
  // Buscar el carrito del usuario con user_id 2
  const userCarrito = Array.isArray(carritoData)
    ? carritoData.find(u => u.user_id === 2)
    : carritoData;
 const [carrito, setCarrito] = useState(userCarrito?.items || []);
   
 


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
const handleRemoveCarrito = (id) => {
  setCarrito(carrito.filter(item => item.id !== id));
};
const handleAgregarCarrito = (pizza) => {
  // Busca si ya está en el carrito
  const existe = carrito.find(item => item.id === pizza.id);
  let nuevoCarrito;
  if (existe) {
    // Si ya está, suma cantidad
    nuevoCarrito = carrito.map(item =>
      item.id === pizza.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    );
  } else {
    // Si no está, agrega con cantidad 1
    nuevoCarrito = [...carrito, { ...pizza, cantidad: 1 }];
  }
  setCarrito(nuevoCarrito);
};


  return (
    <>
      <Nav onLogout={() => console.log("Cerrar sesión")} />





      <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif", position: "relative" }}>
        {/* Contenido principal */}
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ width: "65%" }}>
            <h2 style={{ textAlign: "center", color: "#2c3e50" }}> Bienvenido, Jorge , a tu tienda de Pizzas favorita</h2>

           
    
    
    
    
    
    
        <Pizzas
  favoritos={favoritos}
  onAgregarFavorito={handleAgregarFavorito}
  onAgregarCarrito={handleAgregarCarrito}
/>
            <br /><br />

      
      
            <Favoritos
              favoritos={favoritos}
              onEliminarFavorito={handleEliminarFavorito}
              pizzas={pizzas}
            />
          </div>

        
        
          <div style={{ width: "35%", marginLeft: 24 }}>
         <Cart items={carrito} onRemove={handleRemoveCarrito} />

          </div>



        </div>
        <div style={{ clear: "both" }} />
      </div>
    </>
  );
}

