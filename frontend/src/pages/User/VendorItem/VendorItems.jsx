// src/pages/User/VendorItems.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VendorItems.css';

const VendorItems = () => {
  const { vendorId } = useParams(); // URL se vendorId nikalne ke liye
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [vendorId]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      // Backend route: GET /api/user/products/:vendorId
      const res = await axios.get(`http://localhost:5000/user/products/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  // Cart Logic: LocalStorage mein save karna
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check karo agar item pehle se cart mein hai
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Naya item add karo (vendorId ke sath taaki checkout mein kaam aaye)
      cart.push({ ...item, quantity: 1, vendorId: vendorId });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} added to cart!`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="vi-loader">Loading Products...</div>;

  return (
    <div className="vi-wrapper">
      {/* Top Navbar */}
      <div className="vi-navbar">
        <button className="vi-nav-btn" onClick={() => navigate('/user')}>Home</button>
        <button className="vi-nav-btn" onClick={handleLogout}>LogOut</button>
      </div>

      <div className="vi-vendor-title">Products</div>

      {products.length === 0 ? (
        <div className="vi-loader">No products found for this vendor.</div>
      ) : (
        <div className="vi-product-grid">
          {products.map((item) => (
            <div className="vi-card" key={item._id}>
              <div className="vi-img-container">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="vi-no-img">No Image Available</div>
                )}
              </div>
              <div className="vi-card-body">
                <div className="vi-item-name">{item.name}</div>
                <div className="vi-item-price">Price: ₹{item.price}</div>
                <button 
                  className="vi-add-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorItems;