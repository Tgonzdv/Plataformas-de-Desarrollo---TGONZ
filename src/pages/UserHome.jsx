import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import favoritosData from "../Json/favoritos.json";
import PizzasData from "../Json/pizzas.json";
import { pizzaAPI } from "../services/pizzaAPI";
import { favoritesAPI } from "../services/favoritesAPI";
import { cartAPI } from "../services/cartAPI";
import { orderAPI } from "../services/orderAPI";
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
    
    // Log del usuario actual para debugging
    const currentUser = authUtils.getCurrentUser();
    console.log("=== USUARIO LOGUEADO ===");
    console.log("Usuario actual:", currentUser);
    console.log("ID del usuario:", currentUser?.id);
    console.log("Token:", localStorage.getItem('authToken'));
    console.log("========================");
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

  // Cargar carrito desde la API
  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log("=== CARGA INICIAL DEL CARRITO ===");
        console.log("Iniciando carga del carrito...");
        setLoadingCart(true);
        const cartResponse = await cartAPI.getCart();
        console.log("Respuesta completa del carrito inicial:", cartResponse);
        console.log("Items del carrito inicial:", cartResponse.items);
        setCarrito(cartResponse.items || []);
        console.log("=== FIN CARGA INICIAL DEL CARRITO ===");
      } catch (error) {
        console.error("Error al cargar carrito:", error);
        // En caso de error, inicializar como array vacío
        setCarrito([]);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, []);

  // Estados
  const [favoritos, setFavoritos] = useState([]);
  const [favoritePizzas, setFavoritePizzas] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [pizzas, setPizzas] = useState(PizzasData);
  const [loadingPizzas, setLoadingPizzas] = useState(false);

  // Función de diagnóstico para debugging
  window.debugCart = async () => {
    console.log("=== DIAGNÓSTICO COMPLETO DEL CARRITO ===");
    const currentUser = authUtils.getCurrentUser();
    console.log("Usuario logueado:", currentUser);
    console.log("ID del usuario logueado:", currentUser?.id);
    console.log("Token:", localStorage.getItem('authToken'));
    console.log("Estado actual del carrito en frontend:", carrito);
    console.log("Cantidad de items en frontend:", carrito.length);
    
    try {
      const cartResponse = await cartAPI.getCart();
      console.log("Respuesta completa del backend:", cartResponse);
      console.log("UserId del carrito en backend:", cartResponse.userId);
      console.log("Items del carrito en backend:", cartResponse.items);
      console.log("Cantidad de items en backend:", cartResponse.items?.length || 0);
      
      // Comparación específica
      if (currentUser?.id === cartResponse.userId) {
        console.log("✅ MATCH: El usuario logueado coincide con el carrito");
      } else {
        console.log("❌ MISMATCH: El usuario logueado NO coincide con el carrito");
        console.log(`Usuario logueado ID: ${currentUser?.id}, Carrito userId: ${cartResponse.userId}`);
      }
    } catch (error) {
      console.error("Error al obtener carrito del backend:", error);
    }
    console.log("========================================");
  };

  // Función para forzar recarga del carrito
  window.reloadCart = async () => {
    console.log("=== FORZANDO RECARGA DEL CARRITO ===");
    try {
      setLoadingCart(true);
      const cartResponse = await cartAPI.getCart();
      console.log("Respuesta al recargar:", cartResponse);
      setCarrito(cartResponse.items || []);
      console.log("Carrito actualizado:", cartResponse.items || []);
    } catch (error) {
      console.error("Error al recargar carrito:", error);
    } finally {
      setLoadingCart(false);
    }
    console.log("===================================");
  };

  // Función para verificar el contenido del archivo carts.json
  window.checkCartsFile = async () => {
    console.log("=== VERIFICANDO ARCHIVO CARTS.JSON ===");
    try {
      const response = await fetch('http://localhost:5000/api/debug/carts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      console.log("Contenido completo del archivo carts.json:", data);
    } catch (error) {
      console.error("Error al verificar archivo carts:", error);
    }
    console.log("=====================================");
  };

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

  // Función para agregar pizza al carrito usando API
  const handleAgregarCarrito = async (pizza) => {
    try {
      console.log("=== INICIANDO AGREGAR AL CARRITO ===");
      console.log("Pizza a agregar:", pizza);
      console.log("Carrito actual antes de agregar:", carrito);
      
      setLoadingCart(true);
      
      // Agregar al carrito
      const addResponse = await cartAPI.addToCart(pizza.id, 1);
      console.log("Respuesta de agregar al carrito:", addResponse);
      
      // Recargar carrito desde la API con un pequeño delay para asegurar consistencia
      console.log("Recargando carrito desde API...");
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      const cartResponse = await cartAPI.getCart();
      console.log("Respuesta completa del carrito:", cartResponse);
      console.log("Items del carrito:", cartResponse.items);
      
      const newItems = cartResponse.items || [];
      setCarrito(newItems);
      
      console.log("Estado actualizado - nuevo carrito:", newItems);
      console.log("Pizza agregada al carrito exitosamente");
      console.log("=== FIN AGREGAR AL CARRITO ===");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Error al agregar al carrito: " + error.message);
    } finally {
      setLoadingCart(false);
    }
  };

  // Función para eliminar del carrito usando API
  const handleRemoveCarrito = async (itemId) => {
    try {
      setLoadingCart(true);
      await cartAPI.removeFromCart(itemId);
      
      // Recargar carrito desde la API
      const cartResponse = await cartAPI.getCart();
      setCarrito(cartResponse.items || []);
      
      console.log("Item eliminado del carrito exitosamente");
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      alert("Error al eliminar del carrito: " + error.message);
    } finally {
      setLoadingCart(false);
    }
  };

  // Función para hacer pedido
  const handleHacerPedido = async () => {
    try {
      if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
      }

      setLoadingCart(true);
      const orderResponse = await orderAPI.createOrder();
      
      // Limpiar carrito local después de crear el pedido
      setCarrito([]);
      
      alert("Pedido realizado exitosamente. Número de orden: #" + orderResponse.data.id);
      console.log("Pedido creado:", orderResponse.data);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("Error al realizar el pedido: " + error.message);
    } finally {
      setLoadingCart(false);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    navigate("/");
  };

  const currentUser = authUtils.getCurrentUser();

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
            <Cart 
              items={carrito} 
              onRemove={handleRemoveCarrito} 
              onOrder={handleHacerPedido}
              loading={loadingCart}
            />
          </div>


          
        </div>
        <div style={{ clear: "both" }} />
      </div>
    </>
  );
}
