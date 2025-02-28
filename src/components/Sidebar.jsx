// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaFileAlt,
  FaCloud,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "./sidebar.css";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <h2 className="sidebar-title">Reportes</h2>
      <nav>
        <Link to="/" className="sidebar-link">
          <FaChartLine className="icon" /> {expanded && "Dashboard"}
        </Link>
        <Link to="/reportes" className="sidebar-link">
          <FaFileAlt className="icon" /> {expanded && "Reportes"}
        </Link>
        <Link to="/pld" className="sidebar-link">
          <FaFileAlt className="icon" /> {expanded && "PLD"}
        </Link>
        <Link to="/sitiaa" className="sidebar-link">
          <FaCloud className="icon" /> {expanded && "SITI AA"}
        </Link>
        <Link to="/usuario" className="sidebar-link">
          <FaUser className="icon" /> {expanded && "Usuario"}
        </Link>
        <Link to="/logout" className="sidebar-link logout">
          <FaSignOutAlt className="icon" /> {expanded && "Salir"}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
