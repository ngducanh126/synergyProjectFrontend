import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="nav-logo" to="/">
          Synergy
        </Link>
        <div className="nav-links">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/register">
            Register
          </Link>
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
