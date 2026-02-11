// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Apni CSS import kar li

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Backend API ko hit karo
      const res = await axios.post('http://localhost:5000/userLogin', {
        email,
        password
      });

      // Response aane par token aur user details save karo
      const { token, role, _id, name } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', _id);
      localStorage.setItem('userName', name);

      // Super Smart Logic: Role ke hisaab se redirect karo!
      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Vendor') {
        navigate('/vendor');
      } else {
        navigate('/user'); // Normal customer
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid Email or Password');
    }
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          Event Management System
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>User Id</label>
            <input 
              type="email" 
              placeholder="Enter Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="btn-container">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-login">
              Login
            </button>
          </div>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;