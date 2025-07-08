import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/auth";
import usersData from "../Json/users.json";
import pizzasData from "../Json/pizzas.json";
import pedidosData from "../Json/pedidos.json";
import { pizzaAPI } from "../services/pizzaAPI";
import { userAPI } from "../services/userAPI";
import { orderAPI } from "../services/orderAPI";
import AdminDashboard from "../Components/AdminDashboard";
import AdminUsers from "../Components/AdminUsers";
import AdminPizzas from "../Components/AdminPizzas";
import AdminOrders from "../Components/AdminOrders";
import AdminNav from "../Components/AdminNav";
import "../css/adminhome.css";


export default function AdminHome() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Estados para usuarios
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user", email: "" });
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Estados para pizzas
  const [pizzas, setPizzas] = useState([]);
  const [newPizza, setNewPizza] = useState({ nombre: "", precio: "", descripcion: "" });
  const [loadingPizzas, setLoadingPizzas] = useState(false);
  
  // Estados para pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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

  // Cargar pizzas desde la API
  useEffect(() => {
    const loadPizzas = async () => {
      try {
        setLoadingPizzas(true);
        const pizzasFromAPI = await pizzaAPI.getAllPizzas();
        setPizzas(pizzasFromAPI);
      } catch (error) {
        console.error("Error al cargar pizzas:", error);
       
        setPizzas(pizzasData);
      } finally {
        setLoadingPizzas(false);
      }
    };

    loadPizzas();
  }, []);

  // Cargar usuarios desde la API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const usersFromAPI = await userAPI.getAllUsers();
        setUsers(usersFromAPI);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
    
        setUsers(usersData);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // Cargar pedidos desde la API
  useEffect(() => {
    const loadOrdersLocal = async () => {
      try {
        setLoadingOrders(true);
        const ordersFromAPI = await orderAPI.getOrders();
        setPedidos(ordersFromAPI);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      
        setPedidos(pedidosData.map(pedido => ({
          ...pedido,
          status: pedido.status || "pendiente"
        })));
      } finally {
        setLoadingOrders(false);
      }
    };

    // Cargar pedidos inmediatamente
    loadOrdersLocal();

    //  actualización automática cada 30 segundos
    const interval = setInterval(() => {
      loadOrdersLocal();
    }, 30000);

   
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authUtils.logout();
    navigate("/");
  };

  const currentUser = authUtils.getCurrentUser();

  // Funciones para usuarios
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (newUser.username && newUser.password) {
      try {
        const userToAdd = {
          username: newUser.username,
          password: newUser.password,
          email: newUser.email || `${newUser.username}@pizzaya.com`,
          role: newUser.role
        };
        
        // Llamada a la API 
        const createdUser = await userAPI.createUser(userToAdd);
        
        // Actualizar el estado local con el usuario creado
        setUsers([...users, createdUser]);
        setNewUser({ username: "", password: "", role: "user", email: "" });
        
     
        alert("Usuario creado exitosamente");
      } catch (error) {
        console.error("Error al crear usuario:", error);
        alert("Error al crear el usuario: " + error.message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === 1) { // No permitir eliminar admin principal
      alert("No se puede eliminar el usuario administrador principal");
      return;
    }
    
    try {
      // Llamada a la API 
      await userAPI.deleteUser(userId);
      
      // Actualizar el estado local
      setUsers(users.filter(user => user.id !== userId));
      
      
      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar el usuario: " + error.message);
    }
  };

  // Funciones para pizzas
  const handleCreatePizza = async (e) => {
    e.preventDefault();
    if (newPizza.nombre && newPizza.precio && newPizza.descripcion) {
      try {
        const pizzaToAdd = { 
          nombre: newPizza.nombre,
          precio: parseInt(newPizza.precio),
          descripcion: newPizza.descripcion
        };
        
        // Llamada a la API 
        const createdPizza = await pizzaAPI.createPizza(pizzaToAdd);
        
        // Actualizar el estado local con la pizza creada
        setPizzas([...pizzas, createdPizza]);
        setNewPizza({ nombre: "", precio: "", descripcion: "" });
        
      
        alert("Pizza agregada exitosamente");
      } catch (error) {
        console.error("Error al crear pizza:", error);
        alert("Error al agregar la pizza: " + error.message);
      }
    }
  };

  const handleDeletePizza = async (pizzaId) => {
    try {
      // Llamada a la API 
      await pizzaAPI.deletePizza(pizzaId);
      
      // Actualizar el estado local
      setPizzas(pizzas.filter(pizza => pizza.id !== pizzaId));
      
      
      alert("Pizza eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar pizza:", error);
      alert("Error al eliminar la pizza: " + error.message);
    }
  };

  // Funciones para pedidos
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const ordersFromAPI = await orderAPI.getOrders();
      setPedidos(ordersFromAPI);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
  
      setPedidos(pedidosData.map(pedido => ({
        ...pedido,
        status: pedido.status || "pendiente"
      })));
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Llamada a la API  para actualizar el estado
      const updatedOrder = await orderAPI.updateOrderStatus(orderId, newStatus);
      
      // Actualizar el estado local con la respuesta de la API
      setPedidos(pedidos.map(pedido => 
        pedido.id === orderId 
          ? { ...pedido, status: newStatus, updatedAt: updatedOrder.updatedAt }
          : pedido
      ));
      
  
      // Mostrar mensaje de éxito
      const statusMessages = {
        'aceptado': 'Pedido aceptado exitosamente',
        'cancelado': 'Pedido cancelado exitosamente',
        'en_preparacion': 'Pedido marcado como en preparación',
        'entregado': 'Pedido marcado como entregado'
      };
      
      alert(statusMessages[newStatus] || `Estado actualizado a ${newStatus}`);
      
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert("Error al actualizar el estado del pedido: " + error.message);
    }
  };

  // Función para obtener el nombre del usuario por ID
  const getUsernameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : `Usuario ${userId}`;
  };

  // Estadísticas del dashboard
  const stats = {
    totalUsers: users.length,
    totalPizzas: pizzas.length,
    totalOrders: pedidos.length,
    pendingOrders: pedidos.filter(p => p.status === "pendiente").length
  };

  const renderActiveSection = () => {
    switch(activeSection) {
      case "dashboard":
        return <AdminDashboard stats={stats} />;
      case "users":
        return (
          <AdminUsers 
            users={users}
            newUser={newUser}
            setNewUser={setNewUser}
            handleCreateUser={handleCreateUser}
            handleDeleteUser={handleDeleteUser}
            loadingUsers={loadingUsers}
          />
        );
      case "pizzas":
        return (
          <AdminPizzas 
            pizzas={pizzas}
            newPizza={newPizza}
            setNewPizza={setNewPizza}
            handleCreatePizza={handleCreatePizza}
            handleDeletePizza={handleDeletePizza}
            loadingPizzas={loadingPizzas}
          />
        );
      case "orders":
        return (
          <AdminOrders 
            pedidos={pedidos}
            getUsernameById={getUsernameById}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            loadingOrders={loadingOrders}
            onRefresh={loadOrders}
          />
        );
      default:
        return <AdminDashboard stats={stats} />;
    }
  };

  return (
    <div className="admin-container">
      <AdminNav 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      
      {renderActiveSection()}
    </div>
  );
}