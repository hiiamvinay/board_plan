import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleShopNow = () => {
    navigate('/login');
  };

  return (
    <div className="landing">
      <header className="header">
        <div className="top-header">
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
        <div className="main-header">
          <div className="logo">The Fragrance Company</div>
        </div>
      </header>

      <main className="hero">
        <h1>Discover Your Signature Scent</h1>
        <p>Explore our exclusive collection of luxury fragrances</p>
        <button className="cta-btn" onClick={handleShopNow}>Shop Now</button>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="company-info">
            <h3>The Fragrance Company</h3>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;