import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/auth";
import usersData from "../Json/users.json";
import pizzasData from "../Json/pizzas.json";
import pedidosData from "../Json/pedidos.json";
import { pizzaAPI } from "../services/pizzaAPI";
import { userAPI } from "../services/userAPI";
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
  const [pedidos, setPedidos] = useState(pedidosData.map(pedido => ({
    ...pedido,
    status: pedido.status || "pendiente"
  })));

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
        // Fallback a datos locales si la API falla
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
        // Fallback a datos locales si la API falla
        setUsers(usersData);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
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
        
        // Llamada a la API real
        const createdUser = await userAPI.createUser(userToAdd);
        
        // Actualizar el estado local con el usuario creado
        setUsers([...users, createdUser]);
        setNewUser({ username: "", password: "", role: "user", email: "" });
        
        console.log("Usuario creado exitosamente:", createdUser);
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
      // Llamada a la API real
      await userAPI.deleteUser(userId);
      
      // Actualizar el estado local
      setUsers(users.filter(user => user.id !== userId));
      
      console.log("Usuario eliminado exitosamente:", userId);
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
        
        // Llamada a la API real
        const createdPizza = await pizzaAPI.createPizza(pizzaToAdd);
        
        // Actualizar el estado local con la pizza creada
        setPizzas([...pizzas, createdPizza]);
        setNewPizza({ nombre: "", precio: "", descripcion: "" });
        
        console.log("Pizza creada exitosamente:", createdPizza);
        alert("Pizza agregada exitosamente");
      } catch (error) {
        console.error("Error al crear pizza:", error);
        alert("Error al agregar la pizza: " + error.message);
      }
    }
  };

  const handleDeletePizza = async (pizzaId) => {
    try {
      // Llamada a la API real
      await pizzaAPI.deletePizza(pizzaId);
      
      // Actualizar el estado local
      setPizzas(pizzas.filter(pizza => pizza.id !== pizzaId));
      
      console.log("Pizza eliminada exitosamente:", pizzaId);
      alert("Pizza eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar pizza:", error);
      alert("Error al eliminar la pizza: " + error.message);
    }
  };

  // Funciones para pedidos
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setPedidos(pedidos.map(pedido => 
      pedido.orderId === orderId 
        ? { ...pedido, status: newStatus }
        : pedido
    ));
    console.log(`Pedido ${orderId} actualizado a ${newStatus}`);
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