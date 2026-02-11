import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login/Login';
import Signup from './pages/Auth/SignUp/Signup';
import UserPortal from './pages/User/UserPortal/UserPortal';
import VendorItems from './pages/User/VendorItem/VendorItems';
import OrderStatus from './pages/User/OrderStatus/OrderStatus';
import GuestList from './pages/User/GuestList/GuestList';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Pages Import (Jaise jaise banate jayenge, inhe uncomment kar lena)
// import Login from './pages/Auth/Login';
// import Signup from './pages/Auth/Signup';
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import VendorDashboard from './pages/Vendor/VendorDashboard';
// import UserPortal from './pages/User/UserPortal';
// import VendorItems from './pages/User/VendorItems';
// import CartCheckout from './pages/User/CartCheckout';
// import OrderStatus from './pages/User/OrderStatus';
// import GuestList from './pages/User/GuestList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route Login par jayega */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Vendor Routes */}
          <Route path="/vendor" element={<VendorDashboard />} />

          {/* User Routes */}
          <Route path="/user" element={<UserPortal />} />
          <Route path="/user/vendor/:vendorId" element={<VendorItems />} />
          {/* <Route path="/checkout" element={<CartCheckout />} /> */}
          <Route path="/orders" element={<OrderStatus />} />
          <Route path="/guests" element={<GuestList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;