// src/pages/User/CartCheckout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartCheckout.css';

const CartCheckout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: '', state: '', pinCode: '', number: '', paymentMethod: 'Cash'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const calculateTotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Order schema ke hisaab se payload taiyar karo
      const payload = {
        userId,
        vendorId: cartItems[0].vendorId, // Hum assume kar rahe hain ek baar mein ek hi vendor se order ho raha hai
        items: cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: calculateTotal(),
        billingDetails: formData,
        paymentMethod: formData.paymentMethod
      };

      await axios.post('http://localhost:5000/user/order', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Order Placed Successfully!");
      localStorage.removeItem('cart'); // Cart khali karo
      navigate('/orders'); // Order status page pe bhej do
    } catch (err) {
      alert("Error placing order. Check details.");
    }
  };

  return (
    <div className="cc-wrapper">
      <div className="cc-navbar">
        <button className="cc-nav-btn" onClick={() => navigate('/user')}>Home</button>
        <button className="cc-nav-btn" onClick={() => { localStorage.clear(); navigate('/'); }}>LogOut</button>
      </div>

      <div className="cc-section-title">Shopping Cart</div>
      
      <div className="cc-cart-container">
        <table className="cc-table">
          <thead>
            <tr><th>Name</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td><td>₹{item.price}</td><td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
                <td><button className="cc-remove-btn" onClick={() => removeItem(item._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cc-section-title">Details</div>
      <form className="cc-form-grid">
        <div className="cc-input-group"><label>Name</label><input name="name" onChange={handleInputChange} /></div>
        <div className="cc-input-group"><label>Number</label><input name="number" onChange={handleInputChange} /></div>
        <div className="cc-input-group"><label>E-mail</label><input name="email" onChange={handleInputChange} /></div>
        <div className="cc-input-group"><label>Payment Method</label>
          <select name="paymentMethod" onChange={handleInputChange}>
            <option value="Cash">Cash</option><option value="UPI">UPI</option>
          </select>
        </div>
        <div className="cc-input-group"><label>Address</label><input name="address" onChange={handleInputChange} /></div>
        <div className="cc-input-group"><label>State</label><input name="state" onChange={handleInputChange} /></div>
        <div className="cc-input-group"><label>City</label><input name="city" onChange={handleInputChange} /></div>
        <div className="cc-input-group"><label>Pin Code</label><input name="pinCode" onChange={handleInputChange} /></div>
      </form>

      <div className="cc-grand-total">Grand Total: ₹{calculateTotal()}</div>
      <button className="cc-order-btn" onClick={handlePlaceOrder}>Order Now</button>
    </div>
  );
};

export default CartCheckout;