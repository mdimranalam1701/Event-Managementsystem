// src/pages/User/GuestList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuestList.css';

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({ name: '', contactInfo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentGuestId, setCurrentGuestId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/guests/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuests(res.data);
    } catch (err) { console.error("Error fetching guests", err); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update API
        await axios.put(`http://localhost:5000/user/guest/${currentGuestId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsEditing(false);
      } else {
        // Add API
        await axios.post('http://localhost:5000/user/guest', { ...formData, userId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ name: '', contactInfo: '' });
      fetchGuests();
    } catch (err) { alert("Error saving guest"); }
  };

  const handleEdit = (guest) => {
    setIsEditing(true);
    setCurrentGuestId(guest._id);
    setFormData({ name: guest.name, contactInfo: guest.contactInfo });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/user/guest/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGuests();
    } catch (err) { alert("Error deleting guest"); }
  };

  return (
    <div className="gl-wrapper">
      <div className="gl-navbar">
        <button className="gl-nav-btn" onClick={() => navigate('/user')}>Home</button>
        <button className="gl-nav-btn" onClick={() => {localStorage.clear(); navigate('/');}}>LogOut</button>
      </div>

      <div className="gl-card">
        <div className="gl-header">Guest List Management</div>

        {/* Form Section */}
        <div className="gl-form-container">
          <form className="gl-form" onSubmit={handleSubmit}>
            <div className="gl-input-group">
              <label>Guest Name</label>
              <input 
                className="gl-input" name="name" value={formData.name} 
                onChange={handleInputChange} required placeholder="Enter name"
              />
            </div>
            <div className="gl-input-group">
              <label>Contact Info</label>
              <input 
                className="gl-input" name="contactInfo" value={formData.contactInfo} 
                onChange={handleInputChange} placeholder="Email or Phone"
              />
            </div>
            <div className="gl-btn-group">
              <button type="submit" className={`gl-add-btn ${isEditing ? 'gl-update-btn' : ''}`}>
                {isEditing ? 'Update' : 'Add Guest'}
              </button>
              {isEditing && <button className="gl-nav-btn gl-cancel-btn" onClick={() => {setIsEditing(false); setFormData({name:'', contactInfo:''})}}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="gl-table-container">
          <table className="gl-table">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {guests.map(guest => (
                <tr key={guest._id}>
                  <td>{guest.name}</td>
                  <td>{guest.contactInfo || 'N/A'}</td>
                  <td className="gl-action-btns">
                    <button className="gl-edit-btn" onClick={() => handleEdit(guest)}>Edit</button>
                    <button className="gl-delete-btn" onClick={() => handleDelete(guest._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {guests.length === 0 && <p style={{textAlign:'center', marginTop:'10px'}}>No guests added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default GuestList;