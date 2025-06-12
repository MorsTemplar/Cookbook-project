import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="logo">🍲 RecipeShare</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {token && <Link to="/dashboard">Dashboard</Link>}
        {token
          ? <button onClick={handleLogout}>Logout</button>
          : <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
