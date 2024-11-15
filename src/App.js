import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ProductManagement from './ProductManagent';
import UserManagement from './UserManagement';
import Dash from './Dash';
import Cart from './Cart';
import './App.css'
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true); // Set login status to true after successful login
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set login status to false when logged out
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login and Signup Routes */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Only show dashboard and routes after user logs in */}
        {isLoggedIn ? (
          <Route path="/home" element={<DashboardLayout onLogout={handleLogout} />}>
            <Route index element={<Dash />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="cart" element={<Cart />} />
          </Route>
        ) : (
          // Redirect to login page if user is not logged in
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

// Layout with Sidebar for Dashboard
const DashboardLayout = ({ onLogout }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={onLogout} />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

// Sidebar Component that will only be visible after login
const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar" style={{ width: '200px', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h2>WINGS CAFE</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><Link to="/home" style={{ textDecoration: 'none', color: '#000' }}>Dashboard</Link></li>
        <li><Link to="/home/products" style={{ textDecoration: 'none', color: '#000' }}>Product Management</Link></li>
        <li><Link to="/home/users" style={{ textDecoration: 'none', color: '#000' }}>User Management</Link></li>
        <li><Link to="/home/cart" style={{ textDecoration: 'none', color: '#000' }}>Cart</Link></li>
        <li>
        <button onClick={onLogout} className="btn btn-default border w-100 bg-light text-decoration-none">
    <span style={{ color: 'red' }}>Logout</span>
</button>

        </li>
      </ul>
    </div>
  );
};

export default App;
