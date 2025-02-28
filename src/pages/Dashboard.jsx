import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Bienvenido al Dashboard</h2>
      <p>Gestiona reportes regulatorios de forma eficiente.</p>
    </div>
  );
};

export default Dashboard;
