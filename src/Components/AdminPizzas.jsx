import React from "react";

export default function AdminPizzas({ 
  pizzas, 
  newPizza, 
  setNewPizza, 
  handleCreatePizza, 
  handleDeletePizza 
}) {
  return (
    <div className="admin-section">
      <h3>Gestión de Pizzas</h3>
      
      <form onSubmit={handleCreatePizza} className="admin-form">
        <input
          type="text"
          placeholder="Nombre de la pizza"
          value={newPizza.nombre}
          onChange={(e) => setNewPizza({...newPizza, nombre: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={newPizza.precio}
          onChange={(e) => setNewPizza({...newPizza, precio: e.target.value})}
          required
        />
        <textarea
          placeholder="Descripción"
          value={newPizza.descripcion}
          onChange={(e) => setNewPizza({...newPizza, descripcion: e.target.value})}
          required
        />
        <button type="submit" className="admin-btn admin-btn-primary">
          Agregar Pizza
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pizzas.map(pizza => (
            <tr key={pizza.id}>
              <td>{pizza.id}</td>
              <td>{pizza.nombre}</td>
              <td>${pizza.precio.toLocaleString()}</td>
              <td>{pizza.descripcion}</td>
              <td>
                <div className="admin-actions">
                  <button 
                    onClick={() => handleDeletePizza(pizza.id)}
                    className="admin-btn admin-btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
