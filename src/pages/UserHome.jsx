import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import favoritosData from "../Json/favoritos.json";
import PizzasData from "../Json/pizzas.json";
import carritoData from "../Json/carrito.json";
import Pizzas from '../Components/pizzas';
import Favoritos from '../Components/favoritos';
import Cart from '../Components/cart';
import Nav from '../Components/nav';
import { authUtils } from "../utils/auth";
import "../css/userhome.css";

export default function UserHome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!authUtils.isAuthenticated()) {
      navigate("/");
      return;
    }
  }, [navigate]);

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

  const handleLogout = () => {
    authUtils.logout();
    navigate("/");
  };

  const currentUser = authUtils.getCurrentUser();
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
      <Nav onLogout={handleLogout} />

        <div className="userhome-container">
          <h1 className="userhome-header">Tienda de Pizzas</h1>
          <div className="userhome-main">
            <div className="userhome-left">
            <h2 className="userhome-title">
              Bienvenido, Jorge , a tu tienda de Pizzas favorita
            </h2>
         
         
         
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

          <div className="userhome-right">
            <Cart items={carrito} onRemove={handleRemoveCarrito} />
          </div>


          
        </div>
        <div style={{ clear: "both" }} />
      </div>
    </>
  );
}
