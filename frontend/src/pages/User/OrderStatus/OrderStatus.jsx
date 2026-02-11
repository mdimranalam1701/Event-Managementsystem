// src/pages/User/OrderStatus.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderStatus.css';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Backend route: GET /api/user/orders/:userId
      const res = await axios.get(`http://localhost:5000/user/orders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Received") return "os-status-pill os-status-received";
    if (status === "Ready for Shipping") return "os-status-pill os-status-ready";
    if (status === "Out For Delivery") return "os-status-pill os-status-delivery";
    return "os-status-pill";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="os-wrapper">
      {/* Navbar as per wireframe */}
      <div className="os-navbar">
        <button className="os-nav-btn" onClick={() => navigate('/user')}>Home</button>
        <button className="os-nav-btn" onClick={handleLogout}>LogOut</button>
      </div>

      <div className="os-header-title">User Order Status</div>

      {loading ? (
        <div className="os-no-orders">Checking status...</div>
      ) : orders.length === 0 ? (
        <div className="os-no-orders">No orders found yet. Start shopping!</div>
      ) : (
        <div className="os-table-container">
          <table className="os-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>E-mail</th>
                <th>Category</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  {/* Backend mein populate kiya tha isliye vendorId object hai */}
                  <td>{order.vendorId?.name || 'N/A'}</td>
                  <td>{order.vendorId?.email || 'N/A'}</td>
                  <td>{order.vendorId?.category || 'N/A'}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;