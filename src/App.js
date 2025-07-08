import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from './Components/login';
import Register from './Components/Register';
import { authUtils } from './utils/auth';
// Crea componentes para los inicios según el rol
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const isAdmin = authUtils.isAdmin();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  if (adminOnly && !isAdmin) {
    return <UserHome />;
  }
  
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar token al cargar la aplicación
    const verifySession = async () => {
      try {
        if (authUtils.isAuthenticated()) {
          await authUtils.verifyToken();
        }
      } catch (error) {
        console.log("Sesión inválida, limpiando datos...");
        authUtils.logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ fontSize: "2rem" }}>🍕</div>
        <div>Cargando PizzaYa...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminHome />
              </ProtectedRoute>
            } />
            <Route path="/user" element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <div className="footer" style={{ width: "100%", textAlign: "center", marginTop: "auto" }}>
          <p>© 2025 Tomas Gonzalez Zingales - Parcial 2 Plataformas de Desarrollo</p>
        </div>
      </div>
    </Router>
  );
}

 
export default App;
