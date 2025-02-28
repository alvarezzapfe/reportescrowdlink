import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

// Páginas
import Dashboard from "./pages/Dashboard";
import Reportes from "./pages/Reportes";
import PLD from "./pages/PLD";
import SitiAA from "./pages/SitiAA"; // Corrección de mayúsculas/minúsculas
import Usuario from "./pages/Usuario";
import DetallePLD from "./pages/DetallePLD"; // Asegura que la mayúscula coincide con el nombre del archivo

// Estilos
import "./index.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/pld" element={<PLD />} />
              <Route path="/sitiaa" element={<SitiAA />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/detalle-pld/:id" element={<DetallePLD />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
