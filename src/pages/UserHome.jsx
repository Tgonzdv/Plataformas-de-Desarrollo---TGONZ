import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import favoritosData from "../Json/favoritos.json";
import PizzasData from "../Json/pizzas.json";
import carritoData from "../Json/carrito.json";
import { pizzaAPI } from "../services/pizzaAPI";
import { favoritesAPI } from "../services/favoritesAPI";
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

  // Cargar pizzas desde la API
  useEffect(() => {
    const loadPizzas = async () => {
      try {
        setLoadingPizzas(true);
        const pizzasFromAPI = await pizzaAPI.getAllPizzas();
        setPizzas(pizzasFromAPI);
      } catch (error) {
        console.error("Error al cargar pizzas:", error);
        // Mantener datos locales como fallback
        setPizzas(PizzasData);
      } finally {
        setLoadingPizzas(false);
      }
    };

    loadPizzas();
  }, []);

  // Cargar favoritos desde la API
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        const favoritesResponse = await favoritesAPI.getFavorites();
        const favoritePizzaIds = favoritesResponse.favorites?.pizzaIds || [];
        const favoritePizzasData = favoritesResponse.pizzas || [];
        
        setFavoritos(favoritePizzaIds);
        setFavoritePizzas(favoritePizzasData);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        // En caso de error, inicializar como arrays vacíos
        setFavoritos([]);
        setFavoritePizzas([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, []);

  // Estados
  const [favoritos, setFavoritos] = useState([]);
  const [favoritePizzas, setFavoritePizzas] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  // Buscar el carrito del usuario con user_id 2
  const userCarrito = Array.isArray(carritoData)
    ? carritoData.find(u => u.user_id === 2)
    : carritoData;
  const [carrito, setCarrito] = useState(userCarrito?.items || []);
  const [pizzas, setPizzas] = useState(PizzasData);
  const [loadingPizzas, setLoadingPizzas] = useState(false);

  // Función para agregar a favoritos
  const handleAgregarFavorito = async (pizzaId) => {
    try {
      await favoritesAPI.addToFavorites(pizzaId);
      
      // Actualizar estado local
      const newFavoritos = [...favoritos, pizzaId];
      setFavoritos(newFavoritos);
      
      // Encontrar la pizza y agregarla a favoritePizzas
      const pizza = pizzas.find(p => p.id === pizzaId);
      if (pizza) {
        setFavoritePizzas(prev => [...prev, pizza]);
      }
      
      console.log("Pizza agregada a favoritos exitosamente");
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
      alert("Error al agregar a favoritos: " + error.message);
    }
  };

  // Función para eliminar de favoritos
  const handleEliminarFavorito = async (pizzaId) => {
    try {
      await favoritesAPI.removeFromFavorites(pizzaId);
      
      // Actualizar estado local
      const newFavoritos = favoritos.filter(id => id !== pizzaId);
      setFavoritos(newFavoritos);
      
      // Remover de favoritePizzas
      setFavoritePizzas(prev => prev.filter(p => p.id !== pizzaId));
      
      console.log("Pizza eliminada de favoritos exitosamente");
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
      alert("Error al eliminar de favoritos: " + error.message);
    }
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
              Bienvenido, {currentUser?.nombre || 'Usuario'}, a tu tienda de Pizzas favorita
            </h2>
         
         
         
            <Pizzas
              pizzas={pizzas}
              favoritos={favoritos}
              onAgregarFavorito={handleAgregarFavorito}
              onEliminarFavorito={handleEliminarFavorito}
              onAgregarCarrito={handleAgregarCarrito}
              loadingPizzas={loadingPizzas}
            />



            <br /><br />


            <Favoritos
              favoritos={favoritePizzas}
              onEliminarFavorito={handleEliminarFavorito}
              pizzas={pizzas}
              loadingFavorites={loadingFavorites}
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
