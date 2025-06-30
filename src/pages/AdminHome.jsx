import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/auth";
import usersData from "../Json/users.json";
import pizzasData from "../Json/pizzas.json";
import pedidosData from "../Json/pedidos.json";
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
  const [users, setUsers] = useState(usersData);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  
  // Estados para pizzas
  const [pizzas, setPizzas] = useState(pizzasData);
  const [newPizza, setNewPizza] = useState({ nombre: "", precio: "", descripcion: "" });
  
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

  const handleLogout = () => {
    authUtils.logout();
    navigate("/");
  };

  const currentUser = authUtils.getCurrentUser();

  // Funciones para usuarios
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (newUser.username && newUser.password) {
      const id = Math.max(...users.map(u => u.id), 0) + 1;
      const userToAdd = { id, ...newUser };
      setUsers([...users, userToAdd]);
      setNewUser({ username: "", password: "", role: "user" });
      console.log("Usuario creado:", userToAdd);
    }
  };

  const handleDeleteUser = (userId) => {
    if (userId === 1) { // No permitir eliminar admin principal
      alert("No se puede eliminar el usuario administrador principal");
      return;
    }
    setUsers(users.filter(user => user.id !== userId));
    console.log("Usuario eliminado:", userId);
  };

  // Funciones para pizzas
  const handleCreatePizza = (e) => {
    e.preventDefault();
    if (newPizza.nombre && newPizza.precio && newPizza.descripcion) {
      const id = Math.max(...pizzas.map(p => p.id), 0) + 1;
      const pizzaToAdd = { 
        id, 
        nombre: newPizza.nombre,
        precio: parseInt(newPizza.precio),
        descripcion: newPizza.descripcion
      };
      setPizzas([...pizzas, pizzaToAdd]);
      setNewPizza({ nombre: "", precio: "", descripcion: "" });
      console.log("Pizza creada:", pizzaToAdd);
    }
  };

  const handleDeletePizza = (pizzaId) => {
    setPizzas(pizzas.filter(pizza => pizza.id !== pizzaId));
    console.log("Pizza eliminada:", pizzaId);
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