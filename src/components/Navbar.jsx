import React from "react";
import "./../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>
      <div className="navbar-links">
        <a href="/">Inicio</a>
        <a href="/reportes">Reportes</a>
        <a href="/usuario">Usuario</a>
        <a href="/pld">PLD</a>
      </div>
    </nav>
  );
};

export default Navbar;
