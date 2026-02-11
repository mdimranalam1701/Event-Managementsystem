// src/pages/Vendor/VendorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items', 'add', 'orders'
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', image: null });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const vendorId = localStorage.getItem('userId');

  useEffect(() => {
    if (activeTab === 'items') fetchItems();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchItems = async () => {
    const res = await axios.get(`http://localhost:5000/vendor/items/${vendorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`http://localhost:5000/vendor/orders/${vendorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data);
  };

  const handleFileChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

  const handleAddItem = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('vendorId', vendorId);
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('image', formData.image);

    try {
      await axios.post('http://localhost:5000/vendor/item', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert("Item Added!");
      setActiveTab('items');
    } catch (err) { alert("Error adding item"); }
  };

  const updateStatus = async (orderId, status) => {
    await axios.put(`http://localhost:5000/vendor/order/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Status Updated!");
    fetchOrders();
  };

  return (
    <div className="vd-container">
      <div className="vd-banner">WELCOME VENDOR</div>
      
      <div className="vd-nav-tabs">
        <button className={`vd-tab-btn ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>Your Item</button>
        <button className={`vd-tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add New Item</button>
        <button className={`vd-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Transaction</button>
      </div>

      <div className="vd-content-card">
        {activeTab === 'add' && (
          <form className="vd-form" onSubmit={handleAddItem}>
            <div className="vd-input-group"><label>Product Name</label>
              <input className="vd-input" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="vd-input-group"><label>Price</label>
              <input className="vd-input" type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="vd-input-group"><label>Image</label>
              <input type="file" onChange={handleFileChange} required />
            </div>
            <button type="submit" className="vd-submit-btn">Insert Product</button>
          </form>
        )}

        {activeTab === 'items' && (
          <table className="vd-table">
            <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Action</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td><img src={item.image} width="50" alt="" /></td>
                  <td>{item.name}</td><td>₹{item.price}</td>
                  <td><button onClick={async () => { await axios.delete(`http://localhost:5000/vendor/item/${item._id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchItems(); }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="vd-table">
            <thead><tr><th>Customer</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.userId?.name}</td><td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>
                    <select className="vd-status-select" onChange={(e) => updateStatus(order._id, e.target.value)}>
                      <option value="Received">Received</option>
                      <option value="Ready for Shipping">Ready</option>
                      <option value="Out For Delivery">Out for Delivery</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="vd-logout-btn" onClick={() => { localStorage.clear(); navigate('/'); }}>LogOut</button>
    </div>
  );
};

export default VendorDashboard;