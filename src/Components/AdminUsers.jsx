import React from "react";

export default function AdminUsers({ 
  users, 
  newUser, 
  setNewUser, 
  handleCreateUser, 
  handleDeleteUser 
}) {
  return (
    <div className="admin-section">
      <h3>Gestión de Usuarios</h3>
      
      <form onSubmit={handleCreateUser} className="admin-form">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={newUser.username}
          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" className="admin-btn admin-btn-primary">
          Crear Usuario
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <div className="admin-actions">
                  {user.id !== 1 && (
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="admin-btn admin-btn-danger"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
