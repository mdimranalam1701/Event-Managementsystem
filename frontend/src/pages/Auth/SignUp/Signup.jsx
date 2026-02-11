// src/pages/Auth/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role 'User'
  const [category, setCategory] = useState('Catering'); // Default category
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Backend ko bhejne ke liye data taiyar karo
      const payload = { name, email, password, role };
      
      // Agar Vendor hai, tabhi category bhejenge
      if (role === 'Vendor') {
        payload.category = category;
      }

      await axios.post('http://localhost:5000/userRegister', payload);
      
      alert("Registration Successful! Please login.");
      navigate('/'); // Register hone ke baad wapas login page pe bhej do

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error registering user. Try again.');
    }
  };

  return (
    <div className="evt-signup-wrapper">
      <div className="evt-signup-card">
        
        {/* Wireframe ke hisaab se upar ke 2 buttons */}
        <div className="evt-signup-topbar">
          <button type="button">Chart</button>
          <button type="button" onClick={() => navigate('/')}>Back</button>
        </div>

        <div className="evt-signup-title">
          Event Management System
        </div>

        {error && <div className="evt-signup-error">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="evt-signup-form-group">
            <label>Name</label>
            <input 
              type="text" 
              placeholder="User" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="evt-signup-form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="User" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="evt-signup-form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="User" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {/* Role Dropdown */}
          <div className="evt-signup-form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="User">Customer (User)</option>
              <option value="Vendor">Event Vendor</option>
            </select>
          </div>

          {/* Jaadu: Yeh category dropdown tabhi dikhega jab user 'Vendor' select karega */}
          {role === 'Vendor' && (
            <div className="evt-signup-form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Catering">Catering</option>
                <option value="Florist">Florist</option>
                <option value="Decoration">Decoration</option>
                <option value="Lighting">Lighting</option>
              </select>
            </div>
          )}

          <button type="submit" className="evt-signup-submit-btn">
            Sign Up
          </button>
        </form>

      </div>
    </div>
  );
};

export default Signup;