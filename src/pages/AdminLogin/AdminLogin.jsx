import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAdminId } = useAdmin();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setAdminId(data.adminId); // Store the admin ID
        // Redirect to /dashboard
        navigate('/dashboard');
      } else if (response.status === 401) {
        // Handle 401 Unauthorized
        setError('Invalid username or password. Please try again.');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="admin">
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2 className="admin-login-title">Admin Login</h2>
          {error && <p className="admin-login-error">{error}</p>}
          <label htmlFor="username" className="admin-login-label">Username</label>
          <input
            type="text"
            id="username"
            className="admin-login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <label htmlFor="password" className="admin-login-label">Password</label>
          <input
            type="password"
            id="password"
            className="admin-login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="admin-login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;