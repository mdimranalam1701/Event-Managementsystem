// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembership, setSelectedMembership] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || localStorage.getItem('role') !== 'Admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleMembershipChange = (vendorId, value) => {
    setSelectedMembership({ ...selectedMembership, [vendorId]: value });
  };

  const updateMembership = async (vendorId) => {
    try {
      const membership = selectedMembership[vendorId] || "6 months";
      await axios.put(`http://localhost:5000/admin/membership/${vendorId}`, 
        { membership }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Membership Updated Successfully!");
      fetchData();
    } catch (err) {
      alert("Error updating membership");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="ad-wrapper">
      <div className="ad-navbar">
        <div className="ad-nav-title">Admin Control Panel</div>
        <button className="ad-logout-btn" onClick={handleLogout}>LogOut</button>
      </div>

      <div className="ad-maintenance-header">
        Maintenance Menu (Admin Access Only)
      </div>

      <div className="ad-table-container">
        {loading ? <p>Loading System Data...</p> : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Current Membership</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`ad-role-badge ad-role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.role === 'Vendor' ? (
                      <select 
                        className="ad-select"
                        value={selectedMembership[user._id] || user.membership || "6 months"}
                        onChange={(e) => handleMembershipChange(user._id, e.target.value)}
                      >
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                      </select>
                    ) : 'N/A'}
                  </td>
                  <td>
                    {user.role === 'Vendor' && (
                      <button 
                        className="ad-update-btn"
                        onClick={() => updateMembership(user._id)}
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;