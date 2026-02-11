// src/pages/User/UserPortal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPortal.css';

const UserPortal = () => {
  const [category, setCategory] = useState('');
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    
    // Auth Check: Agar login nahi hai toh bahar pheko
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    if (selected) {
      // Jab user category select kare toh usko Vendor list page pe le jao query ke sath
      navigate(`/user/vendors/${selected}`);
    }
  };

  return (
    <div className="up-container">
      {/* Banner */}
      <div className="up-banner">
        WELCOME {userName.toUpperCase()}
      </div>

      <div className="up-main-content">
        <div className="up-selection-area">
          {/* Dropdown Section as per wireframe */}
          <div className="up-dropdown-card">
            <h4>Drop Down</h4>
            <select 
              className="up-select" 
              value={category} 
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              <option value="Catering">Catering</option>
              <option value="Florist">Florist</option>
              <option value="Decoration">Decoration</option>
              <option value="Lighting">Lighting</option>
            </select>
          </div>

          {/* Grid Menu Buttons */}
          <div className="up-grid-menu">
            <button className="up-menu-btn" onClick={() => navigate('/user/vendors/All')}>
              Vendor
            </button>
            <button className="up-menu-btn" onClick={() => navigate('/checkout')}>
              Cart
            </button>
            <button className="up-menu-btn" onClick={() => navigate('/guests')}>
              Guest List
            </button>
            <button className="up-menu-btn" onClick={() => navigate('/orders')}>
              Order Status
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="up-logout-section">
          <button className="up-logout-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;