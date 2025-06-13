import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/login';
// Crea componentes para los inicios según el rol
import AdminHome from './Components/AdminHome';
import UserHome from './Components/UserHome';

function App() {
  return (
    <Router>
      <div className="App" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/user" element={<UserHome />} />
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
