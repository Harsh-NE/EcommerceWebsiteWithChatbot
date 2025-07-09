import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // backend logout logic
    }
    navigate('/login'); // redirect after logout
  };

  return (
    <header style={{
      backgroundColor: '#233142',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ddd'
    }}>
      <h1>Smart Cart</h1>
      <div>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="header-button" style={{ backgroundColor: '#f44336', color: 'white' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ paddingRight: 10 }} className="header-button">Login</Link>
            <Link to="/register" className="header-button">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
